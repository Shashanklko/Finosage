<p align="center">
  <h1 align="center">FINO<span>SAGE</span></h1>
  <p align="center"><strong>AI-Powered Financial Intelligence Platform</strong></p>
  <p align="center">
    Regime-Switching Monte Carlo · Efficient Frontier Optimization · Dynamic Goal Planning
  </p>
</p>

---

## Overview

**FinoSage** is an advanced personal finance platform that combines institutional-grade quantitative models with an intuitive, premium UI. It provides four specialized financial engines, each powered by stochastic simulation and modern portfolio theory.

> **Built with:** React 18 + Vite · FastAPI · NumPy/SciPy · MongoDB · Framer Motion

---

## 🏗 Architecture

```
finosage/
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero/              # Landing page
│   │   │   ├── Discovery/         # Module selection dashboard
│   │   │   ├── Auth/              # Login, Signup, Profile
│   │   │   ├── RetirementEngine/  # Engine 01 — Retirement Wealth Engine
│   │   │   ├── PortfolioAnalyzer/ # Engine 02 — Portfolio Analyzer
│   │   │   ├── GoalPlanner/       # Engine 03 — Wealth Goal Planner
│   │   │   ├── WithdrawalLab/     # Engine 04 — Withdrawal Strategy Lab
│   │   │   ├── Navbar_Footer/     # Global navigation
│   │   │   └── UI/                # Shared UI components
│   │   ├── utils/                 # Currency formatting, helpers
│   │   └── App.jsx                # Root component & routing
│   └── package.json
│
├── server/                    # FastAPI Backend
│   ├── main.py                # App entry, CORS, router mounting
│   ├── auth.py                # JWT authentication, user management
│   ├── config.py              # Environment configuration
│   ├── database.py            # MongoDB (Motor async driver)
│   ├── history.py             # Analysis save/load endpoints
│   ├── engines/
│   │   ├── retirement.py      # Engine 01 — Regime-Switching Monte Carlo
│   │   ├── portfolio.py       # Engine 02 — QMC Sobol + Efficient Frontier
│   │   ├── goal_planner.py    # Engine 03 — Goal-Based Projection
│   │   └── withdrawal.py      # Engine 04 — Withdrawal Strategy Simulator
│   └── requirements.txt
└── README.md
```

---

## 🚀 Engines

### Engine 01 — Retirement Wealth Engine
The flagship engine. A **Markov Regime-Switching Monte Carlo** simulator with:

| Feature | Implementation |
|---|---|
| **Return Model** | Two-state Markov chain (Growth / Stress) with transition matrix |
| **Fat Tails** | Student-t distribution (ν=5) instead of Gaussian |
| **Inflation** | Stochastic regime-linked inflation (Normal / High) |
| **Spending** | Dynamic Guardrail strategy with ±5%/−10% adjustment rules |
| **Calibration** | Regime parameters derived from user's Expected Return & Volatility |
| **Paths** | 10,000 simulated life paths |

**Outputs:** Survival Probability, Corpus at Retirement, Safe Withdrawal Rate (analytical), Health Score, Inflation Impact, Income Volatility, Min Sustainable Return, Savings Gap, Readiness Grade, Failure Year Distribution, and Projected Value fan chart (p10/p50/p90).

### Engine 02 — Portfolio Analyzer
Multi-asset portfolio simulator using **Quasi-Monte Carlo (Sobol sequences)** and **Geometric Brownian Motion**:

- 6 asset classes: Large Cap, Mid/Small Cap, International, Debt, Gold, REITs
- Correlated returns via Cholesky decomposition
- **Efficient Frontier** optimization (50-point Markowitz curve)
- Risk metrics: Sharpe, Sortino, VaR 95%, Max Drawdown
- Monte Carlo fan chart (50 sample paths)

### Engine 03 — Wealth Goal Planner
Goal-based financial planning with Monte Carlo projection:

- Multiple goal types (Retirement, Education, Home, etc.)
- Inflation-adjusted target computation
- Monthly SIP requirement calculator
- Probability of goal achievement

### Engine 04 — Withdrawal Strategy Lab
Compares multiple decumulation strategies head-to-head:

- **Fixed** — Constant inflation-adjusted withdrawal
- **Percentage** — Fixed % of remaining portfolio
- **Guardrail** — Dynamic rules with floor/ceiling adjustments
- **Bucket** — Time-segmented asset allocation
- Side-by-side comparison with survival curves

---

## 🛡 Authentication

- **JWT-based** authentication with access + refresh tokens
- **bcrypt** password hashing
- MongoDB-backed user profiles
- Persistent sessions via localStorage
- Analysis history save/load per user

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **MongoDB** (Atlas or local)

### Backend

```bash
cd server

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Create .env with:
#   MONGO_URL=mongodb+srv://...
#   JWT_SECRET=your-secret-key
#   SMTP_USERNAME=your-email (optional)
#   SMTP_PASSWORD=your-password (optional)

# Run server
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd client

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Framer Motion, Recharts, Lucide Icons |
| **Backend** | FastAPI, Uvicorn, Pydantic v2 |
| **Compute** | NumPy, SciPy (Sobol QMC, Student-t, Cholesky, SLSQP optimizer) |
| **Database** | MongoDB Atlas (Motor async driver) |
| **Auth** | JWT (PyJWT), bcrypt |
| **Styling** | Vanilla CSS with glassmorphism, micro-animations |

---

## 📊 Mathematical Models

### Regime-Switching Returns (Retirement Engine)
```
S_t ∈ {Growth, Stress}

Transition Matrix:
P = | 0.92  0.08 |
    | 0.30  0.70 |

Returns: R_t = μ(S_t) + σ(S_t) · T_ν / √(ν/(ν-2))
where T_ν ~ Student-t(ν=5)
```

### Efficient Frontier (Portfolio Analyzer)
```
min   w'Σw
s.t.  w'μ = target_return
      Σw_i = 1
      w_i ≥ 0
```

### Safe Withdrawal Rate
```
SWR ≈ (E[R] - π) - ½σ²
where π = inflation rate
```

---

## 📁 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/retirement/simulate` | Run retirement simulation |
| `POST` | `/api/portfolio/analyze` | Analyze portfolio allocation |
| `POST` | `/api/goals/simulate` | Run goal planner simulation |
| `POST` | `/api/withdrawal/simulate` | Run withdrawal lab comparison |
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Login |
| `GET`  | `/api/auth/profile` | Get user profile |
| `POST` | `/api/history/save` | Save analysis |
| `GET`  | `/api/history/list` | List saved analyses |

---

## 📜 License

This project is proprietary. All rights reserved.

---

<p align="center">
  <strong>FINOSAGE</strong> · © 2026
</p>
