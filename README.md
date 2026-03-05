<p align="center">
  <img src="client/public/favicon.png" width="80" height="80" alt="Finosage Logo">
</p>

<p align="center">
  <h1 align="center">FINO<span>SAGE</span></h1>
  <p align="center"><strong>Institutional-Grade Financial Intelligence for Everyone</strong></p>
  <p align="center">
    <a href="https://finosage.vercel.app/"><strong>Live Frontend</strong></a> ·
    <a href="https://finosage-0v8e.onrender.com/"><strong>Live API</strong></a> ·
    <a href="https://finosage-0v8e.onrender.com/docs"><strong>API Docs</strong></a>
  </p>
</p>

---

## 💎 Overview

**FinoSage** is an advanced wealth management platform designed to bring professional-grade financial engineering to the retail investor. It moves beyond simple spreadsheets, employing **Stochastic Monte Carlo simulations**, **Markowitz Efficient Frontier optimization**, and **Regime-Switching models** to provide a truly robust view of your financial future.

> **Simulation Core:** 10,000 parallel realities processed per second to ensure survival in all market conditions.

---

## 🚀 The Engines

FinoSage is powered by four specialized quantitative engines:

### 01. Retirement Wealth Engine
*Flagship Intelligence*
- **Model:** Markov Regime-Switching Monte Carlo.
- **Dynamic Logic:** Simulations account for "Growth" vs. "Stress" market states with transitioning probabilities.
- **Fat-Tail Risk:** Uses Student-t distributions to model real-world market crashes that standard Gaussian models miss.
- **Guardrail Spending:** Implements Guyton-Klinger rules for sustainable decumulation.

### 02. Portfolio Strategy Lab
*Modern Portfolio Theory*
- **Optimization:** 50-point Markowitz Efficient Frontier calibration.
- **Simulation:** Geometric Brownian Motion with Cholesky decomposition for correlated asset classes.
- **Risk Metrics:** Deep analytics for Sharpe Ratio, Sortino Ratio, and 95% Value-at-Risk (VaR).

### 03. Tactical Goal Planner
*Goal-Based Investing*
- **Precision:** Inflation-indexed target calculation for specific life milestones.
- **Probability:** Calculates the exact confidence level for achieving goals based on current saving velocity.

### 04. Withdrawal Strategy Lab
*Decumulation Analysis*
- **Comparison:** Head-to-head battle between Fixed-Inflation, Percentage-Based, and Guardrail withdrawal strategies.
- **Survival:** Visualizes portfolio longevity across thousands of potential sequences of returns.

---

## 🏗 Tech Stack

| Layer | Premium Technology |
|---|---|
| **Frontend** | React 18, Vite, Framer Motion (Glassmorphism UI), Recharts |
| **Backend** | FastAPI (High-performance Python), Pydantic v2 (Strict Typing) |
| **Compute** | Python 3.12, NumPy, SciPy (Sobol Sequences, SLSQP Optimizer) |
| **Database** | MongoDB Atlas (Motor Async Driver) |
| **Deployment** | Vercel (Frontend), Render (Backend Scalability) |

---

## ⚡ Quick Start

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Shashanklko/Finosage.git
   cd Finosage
   ```

2. **Backend Setup**
   ```bash
   cd server
   python -m venv .venv
   source .venv/bin/activate # or .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

### Environment Configuration (`server/.env`)
```env
MONGO_URL="your_mongodb_uri"
JWT_SECRET="your_secure_secret"
CORS_ORIGINS="https://finosage.vercel.app,http://localhost:5173"
```

---

## 📊 Quantitative Highlights

### Regime Transition Matrix
We model market volatility using a transition-state matrix $P$:
$$ P = \begin{pmatrix} 0.92 & 0.08 \\ 0.30 & 0.70 \end{pmatrix} $$
*Where state 1 is Growth and state 2 is Stress.*

### Efficient Frontier
We solve the quadratic optimization problem:
$$\min w^T \Sigma w$$
subject to:
- $w^T \mu = R_{target}$
- $\sum w_i = 1$
- $w_i \ge 0$

---

## 📁 Repository Structure

- `/client`: React frontend with a focus on immersive animations and data visualization.
- `/server`: FastAPI backend containing the heavy-duty mathematical engines.
- `/.python-version`: Configured for **Python 3.12** for optimal library compatibility.

---

## 📜 License & Copyright

© 2026 **FinoSage Wealth Intelligence**. All rights reserved.
Developed with precision for high-net-worth financial modeling.

<p align="center">
  <img src="client/public/favicon.png" width="40" height="40">
</p>
