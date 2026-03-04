"""
Engine 01 — Retirement Wealth Engine
Dynamic Regime-Switching Monte Carlo with:
  • Markov regime-switching returns (Growth / Stress)
  • Student-t fat-tail sampling
  • Stochastic inflation regimes
  • Dynamic guardrail spending rules
  • Composite health score & advanced analytics
"""
import numpy as np
from scipy.stats import t as student_t
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


# ── Request schema ─────────────────────────────────────────────
class RetirementRequest(BaseModel):
    currentAge: int = 35
    retirementAge: int = 60
    lifeExpectancy: int = 90
    portfolioValue: float = 5_000_000
    monthlyContribution: float = 50_000
    expectedReturn: float = 11.0
    volatility: float = 14.0
    inflationRate: float = 6.0
    annualWithdrawal: float = 600_000
    strategy: str = "guardrail"
    numPaths: int = 10_000


# ── Regime parameters (base structure) ─────────────────────────
TRANSITION = {"p_GG": 0.92, "p_SS": 0.70}  # p_GS=0.08, p_SG=0.30
NU = 5  # Student-t degrees of freedom

# Inflation regime spread factors
P_INF_HIGH_GIVEN_STRESS = 0.60
P_INF_HIGH_GIVEN_GROWTH = 0.10


def _calibrate_regimes(user_mu: float, user_sigma: float, user_inflation: float):
    """
    Calibrate regime parameters from user inputs.
    Growth regime: user's expected return (slightly optimistic)
    Stress regime: a crash scenario proportional to volatility
    The blended average will be somewhat below user's nominal return,
    which is realistic — regime switching should be conservative.
    """
    # Growth regime: user_mu (their expected return in good times)
    mu_g = user_mu
    # Stress regime: negative return proportional to volatility
    mu_s = -user_sigma * 0.6   # e.g., vol=14% → stress return = -8.4%

    # Volatility: growth gets user_sigma, stress gets 1.8x
    sigma_g = user_sigma
    sigma_s = user_sigma * 1.8

    # Inflation: normal regime = user_inflation, high = 1.5x
    inf_normal_mu = user_inflation
    inf_normal_sigma = max(0.005, user_inflation * 0.25)
    inf_high_mu = user_inflation * 1.5
    inf_high_sigma = max(0.01, user_inflation * 0.50)

    return {
        "growth": {"mu": mu_g, "sigma": sigma_g},
        "stress": {"mu": mu_s, "sigma": sigma_s},
        "inf_normal": {"mu": inf_normal_mu, "sigma": inf_normal_sigma},
        "inf_high": {"mu": inf_high_mu, "sigma": inf_high_sigma},
    }


# ── Regime-switching return generator ──────────────────────────
def _generate_regime_returns(
    n: int, total_years: int, rng: np.random.Generator,
    user_mu: float, user_sigma: float, user_inflation: float
):
    """
    Generate n×total_years return matrix using Markov regime switching
    with Student-t innovations for fat tails.
    Regime parameters are calibrated from user inputs.
    """
    cal = _calibrate_regimes(user_mu, user_sigma, user_inflation)

    returns = np.zeros((n, total_years))
    regimes = np.zeros((n, total_years), dtype=int)  # 0=Growth, 1=Stress
    inflation = np.zeros((n, total_years))

    # Start all paths in Growth
    current_regime = np.zeros(n, dtype=int)

    for yr in range(total_years):
        # ── Transition step ────────────────────────────────
        u = rng.uniform(size=n)
        stay_prob = np.where(current_regime == 0,
                             TRANSITION["p_GG"],
                             TRANSITION["p_SS"])
        current_regime = np.where(u < stay_prob, current_regime,
                                  1 - current_regime)
        regimes[:, yr] = current_regime

        # ── Sample returns (Student-t) ─────────────────────
        mu = np.where(current_regime == 0,
                      cal["growth"]["mu"],
                      cal["stress"]["mu"])
        sigma = np.where(current_regime == 0,
                         cal["growth"]["sigma"],
                         cal["stress"]["sigma"])

        # Student-t with ν degrees of freedom, scaled
        t_samples = student_t.rvs(NU, size=n, random_state=rng)
        scale_factor = np.sqrt(NU / (NU - 2))
        returns[:, yr] = mu + sigma * (t_samples / scale_factor)

        # ── Stochastic inflation ───────────────────────────
        p_high = np.where(current_regime == 1,
                          P_INF_HIGH_GIVEN_STRESS,
                          P_INF_HIGH_GIVEN_GROWTH)
        inf_regime = (rng.uniform(size=n) < p_high).astype(int)

        inf_mu = np.where(inf_regime == 1,
                          cal["inf_high"]["mu"],
                          cal["inf_normal"]["mu"])
        inf_sigma = np.where(inf_regime == 1,
                             cal["inf_high"]["sigma"],
                             cal["inf_normal"]["sigma"])
        inflation[:, yr] = inf_mu + inf_sigma * rng.standard_normal(n)
        inflation[:, yr] = np.clip(inflation[:, yr], 0.0, 0.20)

    return returns, regimes, inflation



# ── Core simulation ────────────────────────────────────────────
def _simulate_retirement(req: RetirementRequest) -> dict:
    rng = np.random.default_rng(42)

    accumulation_years = req.retirementAge - req.currentAge
    withdrawal_years = req.lifeExpectancy - req.retirementAge
    total_years = accumulation_years + withdrawal_years
    n = req.numPaths

    # ── Generate regime-switching returns ──────────────────
    annual_returns, regimes, inflation_paths = _generate_regime_returns(
        n, total_years, rng,
        user_mu=req.expectedReturn / 100,
        user_sigma=req.volatility / 100,
        user_inflation=req.inflationRate / 100,
    )

    # Convert to gross return multipliers: 1 + R_t
    return_multipliers = 1.0 + annual_returns

    # ── Simulate paths ────────────────────────────────────
    corpus = np.full(n, req.portfolioValue, dtype=np.float64)
    yearly_snapshots = np.zeros((n, total_years + 1))
    yearly_snapshots[:, 0] = corpus.copy()

    # Track real withdrawals for income volatility
    real_withdrawals = np.zeros((n, max(withdrawal_years, 1)))
    p_base = np.zeros(n)  # Portfolio at retirement for guardrail

    for yr in range(total_years):
        corpus *= return_multipliers[:, yr]

        if yr < accumulation_years:
            # Flat annual contribution (user specifies in today's rupees)
            corpus += req.monthlyContribution * 12
        else:
            w_yr = yr - accumulation_years

            if w_yr == 0:
                p_base = corpus.copy()
                p_base = np.maximum(p_base, 1.0)  # Prevent division by zero

            # Inflation-adjusted withdrawal
            cum_inflation = np.prod(1 + inflation_paths[:, accumulation_years:yr+1], axis=1)
            real_withdrawal = req.annualWithdrawal * cum_inflation

            if req.strategy == "guardrail":
                # Dynamic guardrail: Formula 8
                ratio = corpus / p_base
                if w_yr == 0:
                    actual = real_withdrawal
                else:
                    prev = real_withdrawals[:, w_yr - 1]
                    yr_inflation = inflation_paths[:, yr]
                    base_adjust = prev * (1 + yr_inflation)

                    actual = np.where(ratio > 1.2, prev * 1.05,
                             np.where(ratio < 0.8, prev * 0.90,
                                      base_adjust))
                corpus -= actual
                real_withdrawals[:, w_yr] = actual
            elif req.strategy == "percentage":
                actual = corpus * 0.04
                corpus -= actual
                real_withdrawals[:, w_yr] = actual
            else:  # fixed
                corpus -= real_withdrawal
                real_withdrawals[:, w_yr] = real_withdrawal

            corpus = np.maximum(corpus, 0)

        yearly_snapshots[:, yr + 1] = corpus.copy()

    # ── Survival probability ──────────────────────────────
    final_corpus = yearly_snapshots[:, -1]
    survived = np.sum(final_corpus > 0)
    survival_rate = round(float(survived / n * 100), 1)

    # ── Percentile projection ─────────────────────────────
    projection = []
    for yr in range(total_years + 1):
        col = yearly_snapshots[:, yr]
        projection.append({
            "year": yr,
            "p10": round(float(np.percentile(col, 10))),
            "p25": round(float(np.percentile(col, 25))),
            "median": round(float(np.percentile(col, 50))),
            "p75": round(float(np.percentile(col, 75))),
            "p90": round(float(np.percentile(col, 90))),
        })

    # ── Failure distribution ──────────────────────────────
    failure_years = []
    for i in range(n):
        path = yearly_snapshots[i, accumulation_years:]
        zeros = np.where(path <= 0)[0]
        if len(zeros) > 0:
            failure_years.append(zeros[0])
    fail_dist = {}
    for y in failure_years:
        bucket = int(y)
        fail_dist[bucket] = fail_dist.get(bucket, 0) + 1
    failure_distribution = [
        {"year": k, "count": v}
        for k, v in sorted(fail_dist.items())
    ]

    # ── Risk metrics ──────────────────────────────────────
    avg_real = float(np.mean(annual_returns[:, :accumulation_years])) * 100
    median_final = float(np.median(final_corpus))
    corpus_at_retirement = round(float(np.median(yearly_snapshots[:, accumulation_years])))
    worst_case = float(np.percentile(final_corpus, 5))
    best_case = float(np.percentile(final_corpus, 95))

    shortfalls = final_corpus[final_corpus <= 0]
    median_shortfall = 0 if len(shortfalls) == 0 else abs(float(np.median(shortfalls)))

    # Sequence risk: std of first-5-year returns post-retirement
    early_start = accumulation_years
    early_end = min(accumulation_years + 5, total_years)
    early_returns = annual_returns[:, early_start:early_end]
    seq_risk = round(float(np.std(early_returns.mean(axis=1)) * 100), 2)

    # Exhaustion age
    if len(failure_years) > 0:
        median_exhaust = req.retirementAge + int(np.median(failure_years))
    else:
        median_exhaust = None

    # ── Safe withdrawal rate (analytical approximation) ───
    # SWR ≈ real_return - 0.5 * σ² (Formula 10)
    real_r = (req.expectedReturn - req.inflationRate) / 100
    vol = req.volatility / 100
    safe_rate = max(1.0, round((real_r - 0.5 * vol**2) * 100, 1))

    # ═══════════════════════════════════════════════════════
    # DYNAMIC METRICS (NEW)
    # ═══════════════════════════════════════════════════════

    # 1. Inflation Impact (Formula 15): Run shock scenario
    shock_corpus = np.full(n, req.portfolioValue, dtype=np.float64)
    shock_snapshots = np.zeros((n, total_years + 1))
    shock_snapshots[:, 0] = shock_corpus.copy()

    for yr in range(total_years):
        shock_corpus *= return_multipliers[:, yr]
        if yr < accumulation_years:
            shock_corpus += req.monthlyContribution * 12
        else:
            w_yr = yr - accumulation_years
            # Force HIGH inflation for first 5 years of retirement
            if w_yr < 5:
                shock_inf = req.inflationRate / 100 * 1.5  # High inflation
            else:
                shock_inf = float(np.mean(inflation_paths[:, yr]))
            real_w = req.annualWithdrawal * ((1 + shock_inf) ** w_yr)
            shock_corpus -= real_w
            shock_corpus = np.maximum(shock_corpus, 0)
        shock_snapshots[:, yr + 1] = shock_corpus.copy()

    shock_survived = np.sum(shock_snapshots[:, -1] > 0) / n * 100
    inflation_impact = round(survival_rate - shock_survived, 1)

    # 2. Income Volatility Score (Formula 13)
    if withdrawal_years > 1:
        # Only measure paths that are still alive (non-zero withdrawals)
        active_mask = real_withdrawals[:, :withdrawal_years] > 0
        active_per_path = np.sum(active_mask, axis=1)
        # Filter paths with at least 5 years of active withdrawals
        valid = active_per_path >= 5
        if np.sum(valid) > 10:
            valid_w = real_withdrawals[valid, :withdrawal_years]
            means = np.mean(valid_w, axis=1)
            means = np.maximum(means, 1.0)
            stds = np.std(valid_w, axis=1)
            cv = stds / means
            avg_cv = float(np.mean(cv))
            income_volatility = round(max(0, min(100, avg_cv * 100)), 1)
        else:
            income_volatility = 95.0  # Very unstable
    else:
        income_volatility = 0.0

    # 3. Min Sustainable Return (Formula 20 — Reverse Stress Test)
    lo_r, hi_r = 0.0, 0.15
    min_return = 0.05
    for _ in range(20):
        mid_r = (lo_r + hi_r) / 2
        test_c = float(np.median(yearly_snapshots[:, accumulation_years]))
        for yr in range(withdrawal_years):
            test_c *= (1 + mid_r)
            test_c -= req.annualWithdrawal * ((1 + req.inflationRate / 100) ** yr)
            if test_c <= 0:
                break
        if test_c > 0:
            min_return = mid_r
            hi_r = mid_r
        else:
            lo_r = mid_r
    min_sustainable_return = round(min_return * 100, 1)

    # 4. Required Corpus (Formula 9)
    real_return = max(0.01, (req.expectedReturn - req.inflationRate) / 100)
    required_corpus = round(req.annualWithdrawal / real_return)

    # 5. Regime Breakdown
    total_growth = int(np.sum(regimes == 0)) // n
    total_stress = total_years - total_growth

    # 6. Composite Health Score (Formula 19)
    s_survival = min(100, survival_rate)
    s_downturn = min(100, max(0, shock_survived))
    s_inflation = min(100, max(0, 100 - inflation_impact * 5))
    s_income = min(100, max(0, 100 - income_volatility))
    health_score = round(
        0.40 * s_survival +
        0.20 * s_downturn +
        0.20 * s_inflation +
        0.20 * s_income, 1
    )

    return {
        "hero": {
            "survivalRate": survival_rate,
            "medianCorpus": round(median_final),
            "corpusAtRetirement": corpus_at_retirement,
            "safeWithdrawalRate": round(safe_rate, 1),
        },
        "projection": projection,
        "riskGrid": {
            "realReturn": round(avg_real, 1),
            "failureRate": round(100 - survival_rate, 1),
            "medianShortfall": round(median_shortfall),
            "sequenceRisk": seq_risk,
        },
        "failureDistribution": failure_distribution,
        "summary": {
            "bestCase": round(best_case),
            "worstCase": round(worst_case),
            "medianFinal": round(median_final),
            "exhaustionAge": median_exhaust,
        },
        "dynamicMetrics": {
            "healthScore": health_score,
            "inflationImpact": inflation_impact,
            "incomeVolatility": income_volatility,
            "minSustainableReturn": min_sustainable_return,
            "requiredCorpus": required_corpus,
            "monthlyIncome": round(corpus_at_retirement * safe_rate / 100 / 12),
            "yearsCovered": round(corpus_at_retirement / max(req.annualWithdrawal, 1)),
            "savingsGap": max(0, round(required_corpus - corpus_at_retirement)),
            "regimeBreakdown": {
                "growthYears": total_growth,
                "stressYears": total_stress,
            },
        },
    }


@router.post("/simulate")
async def simulate_retirement(req: RetirementRequest):
    return _simulate_retirement(req)
