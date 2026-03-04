"""
Engine 02 — Portfolio Analyzer
Regime-Switching QMC + Student-t Fat Tails + Dynamic Correlation
"""
import numpy as np
from scipy.stats.qmc import Sobol
from scipy.stats import norm, t as student_t
from scipy.optimize import minimize
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# ── Asset metadata ────────────────────────────────────────────
ASSET_META = {
    "largeCap":    {"name": "Large Cap Equity",    "mu": 0.132, "sigma": 0.18, "color": "#d4af37"},
    "midSmall":    {"name": "Mid/Small Equity",    "mu": 0.155, "sigma": 0.25, "color": "#3B82F6"},
    "intl":        {"name": "Global Markets",      "mu": 0.10,  "sigma": 0.20, "color": "#8B5CF6"},
    "debt":        {"name": "Bonds & Debt",        "mu": 0.072, "sigma": 0.04, "color": "#10B981"},
    "gold":        {"name": "Gold",                "mu": 0.09,  "sigma": 0.15, "color": "#F59E0B"},
    "commodities": {"name": "Commodities",         "mu": 0.075,  "sigma": 0.18, "color": "#D97706"},
    "reits":       {"name": "Real Estate (REITs)", "mu": 0.11,  "sigma": 0.22, "color": "#EC4899"},
    "liquid":      {"name": "Cash / Liquid Funds", "mu": 0.05,  "sigma": 0.01, "color": "#14B8A6"},
}

# ── Base correlation matrix (Growth regime) ───────────────────
CORR_GROWTH = np.array([
    [ 1.00,  0.85,  0.60, -0.10,  0.05,  0.25,  0.40, -0.05], # largeCap
    [ 0.85,  1.00,  0.55, -0.15,  0.08,  0.30,  0.45, -0.05], # midSmall
    [ 0.60,  0.55,  1.00,  0.00,  0.15,  0.20,  0.35,  0.00], # intl
    [-0.10, -0.15,  0.00,  1.00,  0.20,  0.05,  0.10,  0.10], # debt
    [ 0.05,  0.08,  0.15,  0.20,  1.00,  0.40,  0.05,  0.00], # gold
    [ 0.25,  0.30,  0.20,  0.05,  0.40,  1.00,  0.15,  0.00], # commodities
    [ 0.40,  0.45,  0.35,  0.10,  0.05,  0.15,  1.00,  0.00], # reits
    [-0.05, -0.05,  0.00,  0.10,  0.00,  0.00,  0.00,  1.00], # liquid
])

# Stress correlation: equity pairs increase by +0.2 (capped at 0.95)
EQUITY_INDICES = [0, 1, 2, 5, 6]  # largeCap, midSmall, intl, commodities, reits
CORR_STRESS = CORR_GROWTH.copy()
for i in EQUITY_INDICES:
    for j in EQUITY_INDICES:
        if i != j:
            CORR_STRESS[i, j] = min(0.95, CORR_GROWTH[i, j] + 0.20)

# ── Regime transition ────────────────────────────────────────
TRANSITION = {"p_GG": 0.92, "p_SS": 0.70}
NU = 5  # Student-t degrees of freedom

# ── Risk profile scaling ─────────────────────────────────────
RISK_SCALE = {
    "Conservative": {"mu_scale": 0.85, "sigma_scale": 0.80},
    "Moderate":     {"mu_scale": 1.00, "sigma_scale": 1.00},
    "Aggressive":   {"mu_scale": 1.12, "sigma_scale": 1.10},
}

ASSET_KEYS = list(ASSET_META.keys())


class PortfolioRequest(BaseModel):
    weights: dict = {"largeCap": 35, "midSmall": 15, "intl": 10, "debt": 20, "gold": 5, "commodities": 5, "reits": 5, "liquid": 5}
    amount: float = 5_000_000
    horizon: int = 10
    risk: str = "Moderate"
    numPaths: int = 10_000


def _portfolio_stats(w: np.ndarray, mus: np.ndarray, cov: np.ndarray):
    ret = float(np.dot(w, mus))
    vol = float(np.sqrt(np.dot(w, cov @ w)))
    return ret, vol


def _analyze_portfolio(req: PortfolioRequest) -> dict:
    rng = np.random.default_rng(42)
    n_assets = len(ASSET_KEYS)

    w_raw = np.array([req.weights.get(k, 0) for k in ASSET_KEYS], dtype=np.float64)
    w = w_raw / max(w_raw.sum(), 1e-8)

    # Apply risk profile scaling
    scale = RISK_SCALE.get(req.risk, RISK_SCALE["Moderate"])
    mus = np.array([ASSET_META[k]["mu"] * scale["mu_scale"] for k in ASSET_KEYS])
    sigmas = np.array([ASSET_META[k]["sigma"] * scale["sigma_scale"] for k in ASSET_KEYS])

    # Covariance for Growth regime (used for frontier / Sharpe)
    cov_growth = np.outer(sigmas, sigmas) * CORR_GROWTH
    port_mu, port_sigma = _portfolio_stats(w, mus, cov_growth)

    # Cholesky for both regimes
    L_growth = np.linalg.cholesky(CORR_GROWTH)
    L_stress = np.linalg.cholesky(CORR_STRESS)

    # ── QMC Sobol base samples ────────────────────────────────
    dim = n_assets * req.horizon
    sampler = Sobol(d=dim, scramble=True, seed=42)
    n_paths = min(req.numPaths, 2**13)

    U = sampler.random(n_paths)
    # Student-t inverse CDF for fat tails
    scale_factor = np.sqrt(NU / (NU - 2))
    Z_raw = np.zeros_like(U)
    for j in range(dim):
        Z_raw[:, j] = student_t.ppf(np.clip(U[:, j], 1e-8, 1 - 1e-8), NU) / scale_factor

    Z = Z_raw.reshape(n_paths, req.horizon, n_assets)

    # ── Regime-switching simulation ───────────────────────────
    portfolio_values = np.zeros((n_paths, req.horizon + 1))
    portfolio_values[:, 0] = req.amount
    regimes = np.zeros((n_paths, req.horizon), dtype=int)  # 0=Growth, 1=Stress
    current_regime = np.zeros(n_paths, dtype=int)

    for t in range(req.horizon):
        # Transition
        u = rng.uniform(size=n_paths)
        stay_prob = np.where(current_regime == 0,
                             TRANSITION["p_GG"], TRANSITION["p_SS"])
        current_regime = np.where(u < stay_prob, current_regime, 1 - current_regime)
        regimes[:, t] = current_regime

        # Regime-dependent parameters
        mu_t = np.where(current_regime == 0,
                        1.0, 0.50)[:, None] * mus[None, :]  # Stress: 50% of normal return
        sigma_t = np.where(current_regime == 0,
                           1.0, 1.40)[:, None] * sigmas[None, :]  # Stress: 1.4× vol

        # Correlated innovations per regime
        Z_t = Z[:, t, :]  # (n_paths, n_assets)
        # Apply Cholesky per path based on regime
        is_stress = current_regime == 1
        Z_corr = np.zeros_like(Z_t)
        if np.any(~is_stress):
            Z_corr[~is_stress] = Z_t[~is_stress] @ L_growth.T
        if np.any(is_stress):
            Z_corr[is_stress] = Z_t[is_stress] @ L_stress.T

        # GBM with regime parameters
        drift_t = mu_t - 0.5 * sigma_t**2
        asset_returns = np.exp(drift_t + sigma_t * Z_corr)
        port_return = np.sum(w * asset_returns, axis=1)
        portfolio_values[:, t + 1] = portfolio_values[:, t] * port_return

    # ── Monte Carlo paths (sample 50 for chart) ───────────────
    indices = np.linspace(0, n_paths - 1, 50, dtype=int)
    mc_paths = []
    for idx in indices:
        path = [{"year": yr, "value": round(float(portfolio_values[idx, yr]))}
                for yr in range(req.horizon + 1)]
        mc_paths.append(path)

    # ── CAGR, Volatility ──────────────────────────────────────
    final_values = portfolio_values[:, -1]
    cagr = float(np.median((final_values / req.amount) ** (1 / req.horizon) - 1) * 100)
    annual_returns_all = portfolio_values[:, 1:] / portfolio_values[:, :-1] - 1
    # Median volatility across paths (prevents cross-sectional variance from inflating the number)
    path_vols = np.std(annual_returns_all, axis=1)
    realized_vol = float(np.median(path_vols) * 100)

    # ── Risk metrics ──────────────────────────────────────────
    rf = 0.06
    sharpe = round((port_mu - rf) / port_sigma, 2) if port_sigma > 0 else 0

    downside = annual_returns_all[annual_returns_all < 0]
    downside_vol = float(np.std(downside)) if len(downside) > 0 else 0.01
    sortino = round((port_mu - rf) / downside_vol, 2) if downside_vol > 0 else 0

    # VaR 95%
    var_95 = float(np.percentile(final_values - req.amount, 5))
    var_95_val = round(abs(var_95)) if var_95 < 0 else 0

    # Max Drawdown
    cummax = np.maximum.accumulate(portfolio_values, axis=1)
    drawdowns = (portfolio_values - cummax) / np.maximum(cummax, 1.0)
    path_max_dds = np.min(drawdowns, axis=1)
    # 95th percentile worst drawdown (more realistic than absolute worst of 10,000 paths)
    max_dd = round(float(np.percentile(path_max_dds, 5)) * 100, 1)

    # ── Behavioral Risk Metrics ───────────────────────────────

    # 1. Emotional Risk (Drawdown thresholds)
    # What % of paths hit -20%, -40%, -60% at least once?
    hit_20 = round(float(np.mean(path_max_dds <= -0.20)) * 100, 1)
    hit_40 = round(float(np.mean(path_max_dds <= -0.40)) * 100, 1)
    hit_60 = round(float(np.mean(path_max_dds <= -0.60)) * 100, 1)

    # 2. Recovery Time & Time Underwater
    # Simple metric: % of years where portfolio is below previous high
    is_underwater = portfolio_values[:, 1:] < cummax[:, :-1]
    avg_years_underwater = round(float(np.mean(np.sum(is_underwater, axis=1))), 1)

    # 3. Loss Probability (Horizon based)
    p_loss_1y = round(float(np.mean(portfolio_values[:, min(1, req.horizon)] < req.amount)) * 100, 1)
    p_loss_3y = round(float(np.mean(portfolio_values[:, min(3, req.horizon)] < req.amount)) * 100, 1)
    p_loss_5y = round(float(np.mean(portfolio_values[:, min(5, req.horizon)] < req.amount)) * 100, 1)

    # 4. Market Regime Realized CAGR
    # Growth vs Stress annualized returns
    growth_mask = regimes == 0
    stress_mask = regimes == 1
    
    growth_returns = annual_returns_all[growth_mask]
    stress_returns = annual_returns_all[stress_mask]
    
    cagr_growth = round(float(np.median(growth_returns)) * 100, 1) if len(growth_returns) > 0 else 0.0
    cagr_stress = round(float(np.median(stress_returns)) * 100, 1) if len(stress_returns) > 0 else 0.0

    # ── Efficient Frontier (50 points) ────────────────────────
    n_frontier = 50
    frontier = []
    for i in range(n_frontier):
        target_ret = 0.05 + i * (0.18 - 0.05) / (n_frontier - 1)

        def neg_vol(ww):
            _, v = _portfolio_stats(ww, mus, cov_growth)
            return v

        constraints = [
            {"type": "eq", "fun": lambda ww: np.sum(ww) - 1},
            {"type": "eq", "fun": lambda ww, tr=target_ret: np.dot(ww, mus) - tr},
        ]
        bounds = [(0, 1)] * n_assets
        w0 = np.ones(n_assets) / n_assets
        try:
            res = minimize(neg_vol, w0, method="SLSQP",
                           bounds=bounds, constraints=constraints)
            if res.success:
                r, v = _portfolio_stats(res.x, mus, cov_growth)
                frontier.append({"risk": round(v * 100, 2), "ret": round(r * 100, 2),
                                 "isCurrent": False, "isOptimal": False})
        except Exception:
            pass

    # Current portfolio dot
    curr_r, curr_v = _portfolio_stats(w, mus, cov_growth)
    frontier.append({"risk": round(curr_v * 100, 2), "ret": round(curr_r * 100, 2),
                     "isCurrent": True, "isOptimal": False})

    # Optimal (max Sharpe)
    def neg_sharpe_opt(ww):
        r, v = _portfolio_stats(ww, mus, cov_growth)
        return -(r - rf) / v if v > 0 else 0

    try:
        res_opt = minimize(neg_sharpe_opt, w, method="SLSQP",
                          bounds=[(0, 1)] * n_assets,
                          constraints=[{"type": "eq", "fun": lambda ww: np.sum(ww) - 1}])
        if res_opt.success:
            r_o, v_o = _portfolio_stats(res_opt.x, mus, cov_growth)
            frontier.append({"risk": round(v_o * 100, 2), "ret": round(r_o * 100, 2),
                             "isCurrent": False, "isOptimal": True})
    except Exception:
        pass

    # ── Allocation ────────────────────────────────────────────
    allocation = [
        {"name": ASSET_META[k]["name"], "value": int(w_raw[i]), "color": ASSET_META[k]["color"]}
        for i, k in enumerate(ASSET_KEYS)
    ]

    # ── Correlation matrix labels ─────────────────────────────
    labels = [ASSET_META[k]["name"][:6] for k in ASSET_KEYS]

    return {
        "hero": {
            "cagr": round(cagr, 1),
            "volatility": round(realized_vol, 1),
            "sharpeRatio": sharpe,
            "maxDrawdown": max_dd,
            "var95": var_95_val,
        },
        "efficientFrontier": frontier,
        "allocation": allocation,
        "riskMetrics": {
            "sharpe": sharpe,
            "sortino": sortino,
            "var95": var_95_val,
            "maxDrawdown": max_dd,
        },
        "monteCarloPaths": mc_paths,
        "correlationMatrix": {"labels": labels, "matrix": CORR_GROWTH.tolist()},
        "behavioralMetrics": {
            "emotionalRisk": {"drop20": hit_20, "drop40": hit_40, "drop60": hit_60},
            "recovery": {"averageYearsUnderwater": avg_years_underwater},
            "lossProbability": {"1Y": p_loss_1y, "3Y": p_loss_3y, "5Y": p_loss_5y},
            "regimeShift": {"growthCAGR": cagr_growth, "stressCAGR": cagr_stress},
            "diversificationScore": div_score if 'div_score' in locals() else 0, # Kept for UI backwards compat
        },
    }


@router.post("/analyze")
async def analyze_portfolio(req: PortfolioRequest):
    return _analyze_portfolio(req)
