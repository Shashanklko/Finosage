"""
Engine 03 — Wealth Goal Planner
Quasi-Monte Carlo + Dynamic Programming multi-goal optimization
"""
import numpy as np
from scipy.stats.qmc import Sobol
from scipy.stats import norm
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

GOAL_COLORS = ["#d4af37", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"]
PRIORITY_WEIGHTS = {"High": 3, "Medium": 2, "Low": 1}


class GoalItem(BaseModel):
    name: str = "Dream Home"
    amount: float = 8_000_000
    years: int = 8
    priority: str = "High"


class GoalRequest(BaseModel):
    goals: list[GoalItem] = []
    monthlySavings: float = 80_000
    existingCorpus: float = 1_500_000
    riskProfile: Literal["Conservative", "Moderate", "Aggressive"] = "Moderate"


def _optimize_goals(req: GoalRequest) -> dict:
    if not req.goals:
        return {"error": "No goals provided"}

    np.random.seed(42)
    n_paths = 4096  # Power of 2 for Sobol
    max_years = max(g.years for g in req.goals)
    annual_savings = req.monthlySavings * 12

    # ── Asset Assumptions ─────────────────────────────────────
    mu_eq, sig_eq = 0.12, 0.18
    mu_debt, sig_debt = 0.07, 0.05
    corr_eq_debt = 0.10

    # Cholesky for correlated assets
    cov = np.array([
        [sig_eq**2, corr_eq_debt * sig_eq * sig_debt],
        [corr_eq_debt * sig_eq * sig_debt, sig_debt**2]
    ])
    L = np.linalg.cholesky(cov)

    # ── Glide Path Definition ────────────────────────────────
    # Base starting equity allocation based on profile
    risk_bases = {"Conservative": 0.40, "Moderate": 0.60, "Aggressive": 0.80}
    start_eq = risk_bases.get(req.riskProfile, 0.60)

    # Equity steps down by 1.5% per year, flattens at 20%
    w_eq_path = np.clip([start_eq - (0.015 * yr) for yr in range(max_years)], 0.20, 1.0)
    w_debt_path = 1.0 - w_eq_path

    # ── QMC Sobol for 2D assets ──────────────────────────────
    # We need 2 dimensions per year: d = max_years * 2
    sampler = Sobol(d=max_years * 2, scramble=True, seed=42)
    U = sampler.random(n_paths)
    Z = norm.ppf(np.clip(U, 1e-8, 1 - 1e-8))

    # Generate returns year by year
    annual_returns = np.zeros((n_paths, max_years))
    
    for yr in range(max_years):
        # Extract the 2 standard normal vectors for this year
        z_eq = Z[:, yr * 2]
        z_debt = Z[:, yr * 2 + 1]
        
        # Apply Cholesky
        shock_eq = L[0,0] * z_eq + L[0,1] * z_debt
        shock_debt = L[1,0] * z_eq + L[1,1] * z_debt
        
        # Log-normal returns for each asset class
        ret_eq = np.exp((mu_eq - 0.5 * sig_eq**2) + shock_eq)
        ret_debt = np.exp((mu_debt - 0.5 * sig_debt**2) + shock_debt)
        
        # Blended portfolio return based on the glide path weights for this year
        annual_returns[:, yr] = w_eq_path[yr] * ret_eq + w_debt_path[yr] * ret_debt

    # ── Simulate total corpus over time ──────────────────────
    corpus_paths = np.zeros((n_paths, max_years + 1))
    corpus_paths[:, 0] = req.existingCorpus

    for yr in range(max_years):
        corpus_paths[:, yr + 1] = corpus_paths[:, yr] * annual_returns[:, yr] + annual_savings

    # ── DP: Priority-weighted allocation ─────────────────────
    # Sort goals by priority (high first), then by timeline (shorter first)
    sorted_goals = sorted(req.goals, key=lambda g: (-PRIORITY_WEIGHTS.get(g.priority, 1), g.years))

    goal_results = []
    total_goal_value = sum(g.amount for g in req.goals)

    for idx, goal in enumerate(sorted_goals):
        corpus_at_target = corpus_paths[:, goal.years]
        # Success = corpus at target year >= goal amount (considering cumulative allocation)
        cumulative_allocated = sum(gr["funded_float"] for gr in goal_results)
        available = corpus_at_target - cumulative_allocated
        success_mask = available >= goal.amount
        probability = round(float(np.mean(success_mask) * 100), 0)

        # Funded amount (median of what's available vs target)
        funded_median = float(np.clip(np.median(available), 0, goal.amount))

        goal_results.append({
            "name": goal.name,
            "target": f"₹{goal.amount / 100000:.0f} L",
            "probability": int(probability),
            "priority": goal.priority.lower(),
            "funded": f"₹{funded_median / 100000:.1f} L",
            "funded_float": funded_median,
        })

    # Count fully funded goals (prob >= 80%)
    goals_funded = sum(1 for g in goal_results if g["probability"] >= 80)

    # ── Timeline data ────────────────────────────────────────
    timeline = []
    for i, goal in enumerate(sorted_goals):
        timeline.append({
            "name": goal.name,
            "years": goal.years,
            "maxYears": max_years,
            "probability": goal_results[i]["probability"],
            "color": GOAL_COLORS[i % len(GOAL_COLORS)],
        })

    # ── Funding trajectory data ──────────────────────────────
    funding_data = []
    for yr in range(max_years + 1):
        row = {"year": yr}
        median_corpus = float(np.median(corpus_paths[:, yr]))
        allocated = 0
        for i, goal in enumerate(sorted_goals):
            if yr <= goal.years:
                share = min(goal.amount * (yr / goal.years), goal.amount)
            else:
                share = goal.amount
            key = goal.name.lower().replace(" ", "_").replace("'", "")
            row[key] = round(share)
            allocated += share
        funding_data.append(row)

    # ── Tradeoff: Current vs Optimized ───────────────────────
    # Find minimum monthly savings for 90% overall
    optimal_savings = req.monthlySavings
    for test_savings in range(int(req.monthlySavings), int(req.monthlySavings * 2), 5000):
        test_annual = test_savings * 12
        test_corpus = np.zeros((n_paths, max_years + 1))
        test_corpus[:, 0] = req.existingCorpus
        for yr in range(max_years):
            test_corpus[:, yr + 1] = test_corpus[:, yr] * annual_returns[:, yr] + test_annual
        all_funded = True
        for goal in sorted_goals:
            if float(np.mean(test_corpus[:, goal.years] >= goal.amount)) < 0.90:
                all_funded = False
                break
        if all_funded:
            optimal_savings = test_savings
            break

    # Current overall probability
    overall_prob = int(np.mean([g["probability"] for g in goal_results]))

    # Optimized probability recalc
    opt_annual = optimal_savings * 12
    opt_corpus = np.zeros((n_paths, max_years + 1))
    opt_corpus[:, 0] = req.existingCorpus
    for yr in range(max_years):
        opt_corpus[:, yr + 1] = opt_corpus[:, yr] * annual_returns[:, yr] + opt_annual
    opt_probs = []
    for goal in sorted_goals:
        opt_probs.append(float(np.mean(opt_corpus[:, goal.years] >= goal.amount) * 100))
    opt_overall = int(np.mean(opt_probs))
    opt_funded = sum(1 for p in opt_probs if p >= 80)

    # Shortfall
    shortfall = 0
    for i, goal in enumerate(sorted_goals):
        if goal_results[i]["probability"] < 80:
            shortfall += goal.amount - goal_results[i]["funded_float"]

    # Required annual savings
    required_savings = round(optimal_savings * 12)

    # Clean funded_float from output
    clean_results = [{k: v for k, v in g.items() if k != "funded_float"} for g in goal_results]

    return {
        "overall": {
            "achievementRate": overall_prob,
            "goalsFunded": f"{goals_funded}/{len(req.goals)}",
            "totalValue": round(total_goal_value),
            "longestHorizon": max_years,
            "requiredSavings": required_savings,
        },
        "goals": clean_results,
        "timeline": timeline,
        "fundingData": funding_data,
        "tradeoff": {
            "current": {
                "savings": f"₹{req.monthlySavings / 1000:.0f}K",
                "goals": f"{goals_funded}/{len(req.goals)}",
                "probability": f"{overall_prob}%",
                "shortfall": f"₹{shortfall / 100000:.0f}L",
            },
            "optimized": {
                "savings": f"₹{optimal_savings / 1000:.0f}K",
                "goals": f"{opt_funded}/{len(req.goals)}",
                "probability": f"{opt_overall}%",
                "shortfall": "₹0",
            },
        },
    }


@router.post("/optimize")
async def optimize_goals(req: GoalRequest):
    return _optimize_goals(req)
