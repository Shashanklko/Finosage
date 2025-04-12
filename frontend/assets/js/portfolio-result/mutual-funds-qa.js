/**
 * Mutual Funds Q&A Module
 * 
 * This module contains educational content about mutual funds,
 * including frequently asked questions and glossary terms.
 */

export const mutualFundTerms = {
    "NAV": "Net Asset Value - The price at which mutual fund units are bought and sold. It represents the per-unit market value of the fund's assets.",
    "SIP": "Systematic Investment Plan - A method to invest a fixed amount in mutual funds at regular intervals, typically monthly.",
    "Lump Sum": "A one-time investment of a larger amount in a mutual fund, as opposed to regular smaller investments.",
    "Exit Load": "A fee charged when an investor sells mutual fund units before a specified period. It's designed to discourage early withdrawals.",
    "Direct Plan": "A mutual fund plan where investors buy directly from the fund house without involving a distributor, resulting in lower expense ratios.",
    "Regular Plan": "A mutual fund plan purchased through a distributor who receives a commission, resulting in a higher expense ratio compared to direct plans.",
    "ELSS": "Equity Linked Savings Scheme - A type of equity mutual fund that offers tax benefits under Section 80C of the Income Tax Act, with a mandatory 3-year lock-in period.",
    "SWP": "Systematic Withdrawal Plan - A facility that allows investors to withdraw a fixed amount from their mutual fund investment at regular intervals.",
    "STP": "Systematic Transfer Plan - A facility that allows investors to transfer a fixed amount from one mutual fund to another at regular intervals.",
    "NFO": "New Fund Offer - The initial offering of a mutual fund scheme to investors, similar to an IPO for stocks.",
    "Expense Ratio": "The annual fee charged by a mutual fund to cover operating expenses, expressed as a percentage of the fund's average assets.",
    "AUM": "Assets Under Management - The total market value of all assets managed by a mutual fund."
};

export const mutualFundQA = [
    {
        question: "What's better - lump sum or SIP for mutual funds?",
        answer: "SIPs are better for most investors because they: (1) Average your purchase cost through market cycles, (2) Create discipline without timing the market, (3) Match monthly salary flows. Consider lump sum only when: (1) Markets are clearly undervalued after a major correction, (2) You have specific short-term goals within 1-2 years."
    },
    {
        question: "How to choose between direct and regular mutual funds?",
        answer: "Direct plans have 0.5-1.5% lower annual expense ratios than regular plans since they eliminate distributor commissions. This creates ~25-30% more wealth over 20 years. Choose direct if you're comfortable researching funds yourself. Choose regular only if you need ongoing professional guidance from an advisor who can provide personalized assistance beyond fund selection."
    },
    {
        question: "Which mutual funds should I start with as a beginner?",
        answer: "Start with these fund types: (1) A large-cap index fund tracking Nifty 50 (40% of equity), (2) A flexicap or multicap fund for broader exposure (30% of equity), (3) A corporate bond fund with high-quality holdings (debt portion). Specific recommended funds: UTI Nifty Index Fund, Parag Parikh Flexi Cap, and ICICI Prudential Corporate Bond Fund. Start with SIPs rather than lump sum investments."
    },
    {
        question: "How much tax will I pay on mutual fund returns?",
        answer: "Equity funds: (1) Held <1 year: 15% STCG tax, (2) Held >1 year: 10% LTCG tax on gains above ₹1 lakh/year. Debt funds: (1) Held <3 years: Gains added to income, taxed at your slab rate, (2) Held >3 years: 20% LTCG tax with indexation benefit. ELSS funds qualify for ₹1.5 lakh tax deduction under Section 80C with 3-year lock-in period."
    },
    {
        question: "What's the difference between growth and dividend options?",
        answer: "Growth option compounds returns within the fund (NAV increases) with no regular payouts. Dividend (IDCW) option distributes profits periodically, reducing NAV after each payout. Growth option provides 25-35% higher long-term returns due to compounding and is more tax-efficient for most investors. Choose dividend option only if you specifically need regular income, like in retirement."
    },
    {
        question: "How to track mutual fund performance effectively?",
        answer: "Track these 5 key metrics: (1) Trailing returns (1/3/5 years) compared to both benchmark and category average, (2) Rolling returns for consistency across market cycles, (3) Downside capture ratio to measure protection during downturns, (4) Expense ratio impact on net returns, (5) Risk-adjusted returns using Sharpe ratio. Use platforms like ValueResearch, MorningStar, or CAMS statements for comprehensive tracking."
    },
    {
        question: "What's a good mutual fund SIP amount to start with?",
        answer: "Start with ₹5,000-10,000 monthly across 2-3 mutual funds if your monthly income is ₹50,000+. For lower incomes, allocate at least 15% of your salary. The absolute minimum should be ₹500-1,000 monthly per fund. Increase your SIP amount by at least 10% annually with salary raises. The amount should align with specific goals - for a ₹1 crore corpus in 15 years at 12% returns, you need approximately ₹20,000 monthly."
    },
    {
        question: "How do I build a mutual fund portfolio for retirement?",
        answer: "For retirement over 15+ years away: (1) 75% in equity funds (25% index fund, 25% flexicap, 15% midcap, 10% international), (2) 25% in debt funds (corporate bond/banking PSU), (3) Use SIPs aligned with salary dates, (4) Increase SIP by 10% annually, (5) Rebalance yearly. With 5-15 years to retirement: Gradually shift to 50% equity/50% debt. Under 5 years to retirement: 30% equity/70% debt with focus on capital preservation."
    },
    {
        question: "What's the ideal mutual fund portfolio for maximum returns?",
        answer: "For maximum long-term returns with 10+ year horizon: (1) 40% in a low-cost Nifty/Sensex index fund, (2) 25% in a quality midcap fund, (3) 15% in a small cap fund, (4) 10% in a focused international fund, (5) 10% in sectoral/thematic funds based on high-conviction themes. This portfolio targets 15-18% CAGR but comes with higher volatility (25-30% potential drawdowns). Essential to maintain through market cycles without panic selling."
    },
    {
        question: "How do I switch from regular to direct mutual funds?",
        answer: "To switch from regular to direct plans: (1) For equity funds held <1 year, wait until 1-year mark to avoid exit load and higher STCG tax, (2) For equity funds held >1 year, switch only if investment amount is large enough to offset 10% LTCG tax impact, (3) For debt funds, evaluate based on your tax slab. Use platforms like Kuvera, Groww, or MF Utilities for the transition. Consider gradual STP instead of lump sum switching to reduce timing risk."
    },
    {
        question: "What are ELSS funds and how do they work?",
        answer: "ELSS (Equity Linked Savings Scheme) funds are tax-saving mutual funds that: (1) Invest 80%+ in equities, (2) Qualify for tax deduction up to ₹1.5 lakh under Section 80C, (3) Have the shortest lock-in period (3 years) among tax-saving instruments, (4) Historically deliver 12-14% annual returns over long periods. Each SIP installment has its own 3-year lock-in, calculated from the specific investment date. Returns are taxed like regular equity funds after the lock-in period."
    },
    {
        question: "What are liquid funds and how to use them?",
        answer: "Liquid funds invest in very short-term money market instruments maturing within 91 days. Use them for: (1) Emergency fund that beats savings account returns (5-6% vs 3-4%), (2) Parking money temporarily before major expenses or investments, (3) STP into equity funds to avoid lump sum timing risk. Benefits include high safety, next-day redemption, no exit load, and better post-tax returns than FDs for periods over 3 years. Ideal for amounts you need within 3-6 months."
    },
    {
        question: "What are the biggest mistakes to avoid with mutual funds?",
        answer: "Top mutual fund mistakes: (1) Chasing recent top performers rather than consistent funds, (2) Excessive portfolio churn instead of long-term holding, (3) Investing lump sums at market peaks, (4) Stopping SIPs during market corrections, (5) Having too many funds (over 5-7) creating overlap, (6) Choosing dividend option for growth needs, (7) Ignoring expense ratios and regular vs direct plans, (8) Not aligning fund choices with specific financial goals and time horizons."
    },
    {
        question: "What's the difference between active and index mutual funds?",
        answer: "Index funds passively track market indices with very low expense ratios (0.1-0.5%), while active funds have managers selecting stocks to beat benchmarks with higher expense ratios (1-2.5%). For large-caps, index funds increasingly outperform as markets become efficient. For mid/small-caps, skilled active managers can still deliver outperformance. An ideal portfolio combines both: index funds for large-cap exposure (lower costs, guaranteed market returns) and active funds for mid/small-cap segments where manager skill adds more value."
    },
    {
        question: "How do I analyze and select the best mutual funds?",
        answer: "Select mutual funds using these criteria: (1) 5-year performance vs both benchmark and category average, (2) Consistency across market cycles using rolling returns, (3) Downside protection during market corrections, (4) Fund manager experience and tenure (preferably 5+ years), (5) Low expense ratio compared to category average, (6) Portfolio concentration and quality, (7) Fund size concerns (too large or too small), (8) AMC reputation and processes. For beginners, index funds are often the best starting point before exploring active funds."
    }
];

/**
 * Creates the markup for FAQ items
 * @returns {string} HTML markup for FAQ items
 */
export function createFAQMarkup() {
    return mutualFundQA.map((item, index) => `
        <div class="qa-item" data-index="${index}">
            <div class="qa-question">
                ${item.question}
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="qa-answer">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Creates the markup for glossary terms
 * @returns {string} HTML markup for glossary terms
 */
export function createTermsMarkup() {
    return Object.entries(mutualFundTerms).map(([term, definition]) => `
        <div class="term-item">
            <div class="term-name">${term}</div>
            <div class="term-definition">${definition}</div>
        </div>
    `).join('');
} 