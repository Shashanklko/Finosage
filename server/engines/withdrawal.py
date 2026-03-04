"""
Engine 04 — Withdrawal Strategy Lab
Dynamic Programming + Quasi-Monte Carlo + Multi-scenario Stress Testing
"""
import numpy as np
from scipy.stats.qmc import Sobol
from scipy.stats import norm
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class WithdrawalRequest(BaseModel):
    corpus: float = 30_000_000
    annualWithdrawal: float = 1_200_000
    retirementAge: int = 60
    horizon: int = 30
    inflationRate: float = 6.0
    strategy: str = "guardrail"
    taxRate: float = 10.0
    scenarios: list[str] = ["baseline", "crash", "inflation"]


# ── Scenario modifiers ───────────────────────────────────────
SCENARIO_META = {
    "baseline":    {"name": "Baseline",                   "mu_adj": 0.0,   "sigma_adj": 0.0, "inflation_adj": 0.0, "shock_year": None, "shock_mag": 0.0, "extra_years": 0},
    "crash":       {"name": "Market Crash (Year 2)",      "mu_adj": -0.02, "sigma_adj": 0.05, "inflation_adj": 0.0, "shock_year": 2,    "shock_mag": -0.40, "extra_years": 0},
    "inflation":   {"name": "High Inflation",             "mu_adj": -0.01, "sigma_adj": 0.02, "inflation_adj": 0.03, "shock_year": None, "shock_mag": 0.0, "extra_years": 0},
    "stagflation": {"name": "Stagflation",                "mu_adj": -0.04, "sigma_adj": 0.03, "inflation_adj": 0.04, "shock_year": None, "shock_mag": 0.0, "extra_years": 0},
    "longevity":   {"name": "Extended Longevity (+10yr)", "mu_adj": 0.0,   "sigma_adj": 0.0, "inflation_adj": 0.0, "shock_year": None, "shock_mag": 0.0, "extra_years": 10},
    "sequence":    {"name": "Poor Sequence of Returns",   "mu_adj": -0.06, "sigma_adj": 0.04, "inflation_adj": 0.0, "shock_year": None, "shock_mag": 0.0, "extra_years": 0, "bad_years": 5},
}


def _stress_test(req: WithdrawalRequest) -> dict:
    np.random.seed(42)
    base_mu = 0.10
    base_sigma = 0.15
    inflation = req.inflationRate / 100
    n_paths = 4096

    # ── QMC base return sequences ────────────────────────────
    max_horizon = req.horizon + 10  # Allow for longevity scenario
    sampler = Sobol(d=max_horizon, scramble=True, seed=42)
    U = sampler.random(n_paths)
    Z_base = norm.ppf(np.clip(U, 1e-8, 1 - 1e-8))

    # ── Run each scenario ────────────────────────────────────
    stress_results = []
    guardrail_data = None
    corpus_projection = None
    schedule = None
    
    # Track baseline for insights
    baseline_actual_arr = None
    baseline_inflation = inflation
    baseline_withdrawal_paths = None
    baseline_final_median = 0.0

    for scenario_id in req.scenarios:
        meta = SCENARIO_META.get(scenario_id, SCENARIO_META["baseline"])
        sc_mu = base_mu + meta["mu_adj"] - (req.taxRate / 100.0 * 0.15) # Simplified tax drag on growth
        sc_sigma = base_sigma + meta["sigma_adj"]
        sc_inflation = inflation + meta["inflation_adj"]
        sc_horizon = req.horizon + meta["extra_years"]
        Z = Z_base[:, :sc_horizon]

        # Apply sequence-of-return bias (first N years have worse returns)
        bad_years = meta.get("bad_years", 0)
        if bad_years > 0:
            Z[:, :bad_years] -= 1.5  # Shift distribution negative

        annual_returns = np.exp((sc_mu - 0.5 * sc_sigma**2) + sc_sigma * Z)

        # Apply shock
        if meta["shock_year"] is not None and meta["shock_year"] <= sc_horizon:
            annual_returns[:, meta["shock_year"] - 1] *= (1 + meta["shock_mag"])

        # ── Simulate corpus with chosen strategy ─────────────
        corpus = np.full(n_paths, req.corpus, dtype=np.float64)
        yearly_corpus = np.zeros((n_paths, sc_horizon + 1))
        yearly_corpus[:, 0] = req.corpus
        yearly_withdrawal = np.zeros((n_paths, sc_horizon))
        upper_arr = np.zeros(sc_horizon)
        lower_arr = np.zeros(sc_horizon)
        actual_arr = np.zeros(sc_horizon)

        for yr in range(sc_horizon):
            corpus *= annual_returns[:, yr]
            base_w = req.annualWithdrawal * ((1 + sc_inflation) ** yr)

            if req.strategy == "guardrail":
                upper = base_w * 1.2
                lower = base_w * 0.75
                actual = np.clip(corpus * 0.041, lower, upper)
                upper_arr[yr] = upper
                lower_arr[yr] = lower
                actual_arr[yr] = float(np.median(actual))
            elif req.strategy == "percent":
                actual = corpus * 0.04
                upper_arr[yr] = base_w * 1.2
                lower_arr[yr] = base_w * 0.75
                actual_arr[yr] = float(np.median(actual))
            elif req.strategy == "bucket":
                # Bucket: first 5 years from safe assets, rest growth
                if yr < 5:
                    actual = np.full(n_paths, base_w)
                else:
                    actual = np.clip(corpus * 0.045, base_w * 0.8, base_w * 1.3)
                upper_arr[yr] = base_w * 1.3
                lower_arr[yr] = base_w * 0.8
                actual_arr[yr] = float(np.median(actual))
            else:  # fixed
                actual = np.full(n_paths, base_w)
                upper_arr[yr] = base_w
                lower_arr[yr] = base_w
                actual_arr[yr] = base_w

            corpus -= actual
            corpus = np.maximum(corpus, 0)
            yearly_corpus[:, yr + 1] = corpus
            yearly_withdrawal[:, yr] = actual

        # ── Survival rate ────────────────────────────────────
        final = yearly_corpus[:, -1]
        survival_rate = round(float(np.mean(final > 0) * 100), 0)

        # Median corpus at year 15 (or last year)
        mid_year = min(15, sc_horizon)
        median_corpus_mid = float(np.median(yearly_corpus[:, mid_year]))

        # Depletion age
        depletion_ages = []
        for i in range(n_paths):
            zeros = np.where(yearly_corpus[i, :] <= 0)[0]
            if len(zeros) > 0:
                depletion_ages.append(req.retirementAge + zeros[0])
        median_depletion = int(np.median(depletion_ages)) if depletion_ages else None

        # Tag
        if survival_rate >= 85:
            tag = "pass"
        elif survival_rate >= 60:
            tag = "warn"
        else:
            tag = "fail"

        detail_map = {
            "baseline": f"Normal market conditions — portfolio sustains for full {req.horizon}-year horizon in {int(survival_rate)}% of simulations.",
            "crash": f"A {abs(int(meta['shock_mag']*100))}% drop in year {meta['shock_year']} reduces survival but guardrails auto-reduce withdrawals.",
            "inflation": f"Inflation at {(sc_inflation*100):.0f}% erodes real purchasing power. Guardrails lag behind inflation-adjusted needs.",
            "stagflation": f"Low growth combined with high inflation severely impacts portfolio longevity.",
            "longevity": f"Extended lifespan of {req.horizon + 10} years tests capital endurance beyond planned horizon.",
            "sequence": f"Negative returns in first {bad_years} years create irreversible damage to the corpus.",
        }

        stress_results.append({
            "scenario": meta["name"],
            "survivalRate": f"{int(survival_rate)}%",
            "medianCorpus": f"₹{median_corpus_mid / 10000000:.1f} Cr",
            "depletionAge": str(median_depletion) if median_depletion else "Never",
            "tag": tag,
            "detail": detail_map.get(scenario_id, ""),
        })

        # Capture baseline data for insights
        if scenario_id == "baseline":
            baseline_actual_arr = actual_arr.copy()
            baseline_inflation = sc_inflation
            baseline_withdrawal_paths = yearly_withdrawal.copy()
            baseline_final_median = float(np.median(final))

        # For first scenario, generate detailed data
        if guardrail_data is None:
            guardrail_data = [
                {"year": yr + 1, "actual": round(actual_arr[yr]),
                 "upper": round(upper_arr[yr]), "lower": round(lower_arr[yr])}
                for yr in range(min(req.horizon, sc_horizon))
            ]
            corpus_projection = [
                {"year": yr, "corpus": round(float(np.median(yearly_corpus[:, yr]))),
                 "withdrawal": round(float(np.median(yearly_withdrawal[:, yr]))) if yr < sc_horizon else 0}
                for yr in range(min(req.horizon + 1, sc_horizon + 1))
            ]

            # Year-by-year schedule (sample years)
            sample_years = [0, 2, 4, 9, 14, 19, 24, min(req.horizon - 1, sc_horizon - 1)]
            sample_years = sorted(set(y for y in sample_years if y < sc_horizon))
            schedule = []
            for yr in sample_years:
                med_w = float(np.median(yearly_withdrawal[:, yr]))
                med_c = float(np.median(yearly_corpus[:, yr + 1]))
                rate_pct = (med_w / med_c * 100) if med_c > 0 else 0

                note = ""
                if req.strategy == "guardrail":
                    if actual_arr[yr] <= lower_arr[yr] * 1.05:
                        note = "Floor hit"
                    elif actual_arr[yr] < upper_arr[yr] * 0.9 and yr > 5:
                        note = "Guardrail ↓"

                schedule.append({
                    "year": yr + 1,
                    "age": req.retirementAge + yr,
                    "withdrawal": f"₹{med_w / 100000:.1f} L",
                    "corpus": f"₹{med_c / 10000000:.2f} Cr",
                    "rate": f"{rate_pct:.1f}%" if med_c > 0 else "—",
                    "note": note,
                })

    # ── DP Optimal withdrawal rate ───────────────────────────
    # Binary search for rate that gives ≥90% survival on baseline
    baseline_returns = np.exp((base_mu - 0.5 * base_sigma**2) + base_sigma * Z_base[:, :req.horizon])
    lo, hi = 2.0, 7.0
    optimal_rate = 4.0
    for _ in range(25):
        mid = (lo + hi) / 2
        test_c = np.full(n_paths, req.corpus)
        for yr in range(req.horizon):
            test_c *= baseline_returns[:, yr]
            test_c -= test_c * (mid / 100)
            test_c = np.maximum(test_c, 0)
        surv = np.mean(test_c > 0)
        if surv >= 0.90:
            optimal_rate = mid
            lo = mid
        else:
            hi = mid

    year1_w = float(np.median(yearly_withdrawal[:, 0])) if yearly_withdrawal.shape[1] > 0 else req.annualWithdrawal
    median_15 = float(np.median(yearly_corpus[:, min(15, yearly_corpus.shape[1] - 1)]))
    buffer_years = 0
    if corpus_projection:
        last_positive = [p for p in corpus_projection if p["corpus"] > 0]
        buffer_years = max(0, len(last_positive) - req.horizon) if len(last_positive) > req.horizon else round(float(np.mean(yearly_corpus[:, -1] > 0)) * 6, 1)

    # ── Advanced Insights tier ──────────────────────────────
    # 1. Longevity Risk (Failure prob in longevity scenario)
    longevity_res = next((s for s in stress_results if s["scenario"] == "Baseline"), stress_results[0])
    # Better: check if we actually ran longevity
    long_sc = next((s for s in stress_results if "Longevity" in s["scenario"]), None)
    longevity_prob = int(long_sc["survivalRate"].replace("%", "")) if long_sc else int(longevity_res["survivalRate"].replace("%", ""))
    longevity_score = 100 - longevity_prob

    # 2. Sequence Penalty (₹ loss in crash vs baseline withdrawal median)
    # Using baseline stats if captured, else fallback
    seq_penalty = 12.5 
    crash_sc = next((s for s in stress_results if "Crash" in s["scenario"]), None)
    if crash_sc:
        crash_surv = int(crash_sc["survivalRate"].replace("%", ""))
        base_surv = int(longevity_res["survivalRate"].replace("%", ""))
        seq_penalty = max(0, base_surv - crash_surv) * 0.8

    # 3. Purchasing Power Erosion (Based on Baseline)
    if baseline_actual_arr is not None:
        y1_w = baseline_actual_arr[0]
        y20_idx = min(19, req.horizon - 1)
        y20_w = baseline_actual_arr[y20_idx]
        y20_real = y20_w / ((1 + baseline_inflation) ** y20_idx)
        erosion_pct = round(max(0, (1 - y20_real / y1_w) * 100), 1) if y1_w > 0 else 0
    else:
        erosion_pct = 0.0

    # 4. Estate Buffer (Final median Cr)
    final_estate = baseline_final_median if baseline_actual_arr is not None else float(np.median(yearly_corpus[:, -1]))

    return {
        "hero": {
            "optimalRate": round(optimal_rate, 1),
            "survivalRate": int(stress_results[0]["survivalRate"].replace("%", "")) if stress_results else 91,
            "year1Withdrawal": round(year1_w),
            "medianCorpus15": round(median_15),
            "buffer": round(buffer_years, 1),
        },
        "advancedInsights": {
            "longevityRisk": int(min(100, longevity_score * 1.2)),
            "sequencePenalty": f"₹{req.annualWithdrawal * (seq_penalty/100) / 100000:.1f} L / yr",
            "purchasingPower": f"{erosion_pct}%",
            "estateBuffer": f"₹{final_estate / 10000000:.2f} Cr",
            "erosionValue": erosion_pct
        },
        "guardrail": guardrail_data or [],
        "stressTests": stress_results,
        "corpusProjection": corpus_projection or [],
        "schedule": schedule or [],
    }


@router.post("/stress-test")
async def stress_test(req: WithdrawalRequest):
    return _stress_test(req)
