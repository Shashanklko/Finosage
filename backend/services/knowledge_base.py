from typing import Optional

class KnowledgeBase:
    def __init__(self):
        self.definitions = {
            "Stock": {
                "keywords": ["stock", "equity", "shares", "ownership"],
                "content": "A stock represents ownership in a company and a claim on part of its assets and earnings. When you buy a stock, you become a shareholder and own a portion of the company."
            },
            "Bond": {
                "keywords": ["bond", "debt", "fixed income", "loan"],
                "content": "A bond is a fixed income instrument where an investor lends money to an entity (typically corporate or governmental) for a defined period at a variable or fixed interest rate."
            },
            "Index": {
                "keywords": ["index", "benchmark", "market index", "stock index"],
                "content": "An index is a statistical measure representing the value of a section of the stock market. It is used to track the performance of a group of assets, such as the S&P 500 or Dow Jones Industrial Average."
            },
            "Bull Market": {
                "keywords": ["bull market", "rising", "uptrend", "bullish"],
                "content": "A bull market is a market condition where prices are rising or are expected to rise. It is characterized by optimism, investor confidence, and expectations that strong results will continue."
            },
            "Bear Market": {
                "keywords": ["bear market", "falling", "downtrend", "bearish"],
                "content": "A bear market is a market condition where prices are falling or expected to fall. It is characterized by pessimism, investor fear, and expectations that negative results will continue."
            },
            "ETF": {
                "keywords": ["etf", "exchange traded fund", "fund", "basket"],
                "content": "An ETF (Exchange-Traded Fund) is a type of fund that is traded on stock exchanges, much like stocks. It holds assets such as stocks, commodities, or bonds and generally operates with an arbitrage mechanism designed to keep it trading close to its net asset value."
            },
            "Mutual Fund": {
                "keywords": ["mutual fund", "managed", "pooled", "investment fund"],
                "content": "A mutual fund is an investment program funded by shareholders that trades in diversified holdings and is professionally managed. It pools money from many investors to purchase securities."
            },
            "REIT": {
                "keywords": ["reit", "real estate", "property", "real estate investment trust"],
                "content": "A REIT (Real Estate Investment Trust) is a company that owns, operates, or finances income-generating real estate. REITs provide a way for individual investors to earn a share of the income produced through commercial real estate ownership."
            },
            "Options": {
                "keywords": ["options", "derivatives", "contract", "right"],
                "content": "Options are financial instruments that give the right, but not the obligation, to buy or sell an asset at a set price on or before a given date. They are commonly used for hedging or speculation."
            },
            "Futures": {
                "keywords": ["futures", "contract", "agreement", "forward"],
                "content": "Futures are standardized legal agreements to buy or sell something at a predetermined price at a specified time in the future. They are commonly used for commodities, currencies, and financial instruments."
            },
            "ROI": {
                "keywords": ["roi", "return", "profit", "return on investment"],
                "content": "ROI (Return on Investment) is a measure of profitability relative to cost. It is calculated by dividing the net profit by the cost of the investment and is often expressed as a percentage."
            },
            "P/E Ratio": {
                "keywords": ["p/e ratio", "valuation", "price to earnings", "multiple"],
                "content": "The P/E (Price-to-Earnings) ratio is used to value a company by comparing its share price to its earnings per share. It helps investors determine if a stock is overvalued or undervalued."
            },
            "Dividend": {
                "keywords": ["dividend", "payout", "income", "distribution"],
                "content": "A dividend is a portion of a company's earnings distributed to shareholders. It represents a reward for investing in the company and is usually paid in cash or additional shares."
            },
            "Dividend Yield": {
                "keywords": ["dividend yield", "income", "return", "payout ratio"],
                "content": "Dividend yield is the dividend per share divided by the price per share. It indicates the income potential of an investment and is expressed as a percentage."
            },
            "Alpha": {
                "keywords": ["alpha", "outperformance", "excess return", "active return"],
                "content": "Alpha is a measure of an investment's performance above a market benchmark. It represents the value that a portfolio manager adds to or subtracts from a fund's return."
            },
            "Beta": {
                "keywords": ["beta", "volatility", "risk", "market sensitivity"],
                "content": "Beta measures a stock's volatility compared to the overall market. A beta of 1 means the stock moves with the market, while a beta greater than 1 indicates higher volatility."
            },
            "Volatility": {
                "keywords": ["volatility", "fluctuation", "risk", "variation"],
                "content": "Volatility indicates how much and how quickly the value of an investment changes. It is often measured by the standard deviation of returns and is used to assess risk."
            },
            "Liquidity": {
                "keywords": ["liquidity", "access", "cash", "convertibility"],
                "content": "Liquidity refers to the ease with which an asset can be converted into cash without affecting its price. High liquidity means an asset can be quickly bought or sold."
            },
            "Market Cap": {
                "keywords": ["market cap", "size", "capitalization", "value"],
                "content": "Market capitalization is the total value of a company's outstanding shares of stock. It is calculated by multiplying the current stock price by the total number of outstanding shares."
            },
            "Capital Gain": {
                "keywords": ["capital gain", "profit", "appreciation", "increase"],
                "content": "A capital gain is the increase in value of an asset or investment over time. It is realized when the asset is sold for more than its purchase price."
            },
            "Asset Allocation": {
                "keywords": ["asset allocation", "strategy", "diversification", "portfolio"],
                "content": "Asset allocation is the process of dividing investments among different asset categories to reduce risk. It involves balancing risk and reward by adjusting the percentage of each asset in a portfolio."
            },
            "Diversification": {
                "keywords": ["diversification", "spreading risk", "variety", "mix"],
                "content": "Diversification is the strategy of investing in various assets to reduce exposure to any one risk. It helps to minimize the impact of any single investment's poor performance."
            },
            "Risk Tolerance": {
                "keywords": ["risk tolerance", "comfort", "willingness", "capacity"],
                "content": "Risk tolerance is an investor's ability to endure potential losses in investment value. It depends on factors like age, financial goals, and personal comfort with uncertainty."
            },
            "Compound Interest": {
                "keywords": ["compound interest", "growth", "accumulation", "reinvestment"],
                "content": "Compound interest is interest calculated on the initial principal and also on accumulated interest. It allows investments to grow exponentially over time."
            },
            "Yield": {
                "keywords": ["yield", "return", "income", "earnings"],
                "content": "Yield is the income return on an investment, usually expressed as a percentage. It includes interest and dividends received during a specific period."
            },
            "NAV": {
                "keywords": ["nav", "net asset value", "value", "price"],
                "content": "NAV (Net Asset Value) is the per-share value of a mutual fund or ETF. It is calculated by dividing the total value of all the securities in the portfolio by the number of shares outstanding."
            },
            "Blue Chip": {
                "keywords": ["blue chip", "reliable", "stable", "established"],
                "content": "A blue chip stock is from a large, stable, and financially sound company with a history of reliable performance. These companies are typically industry leaders."
            },
            "IPO": {
                "keywords": ["ipo", "initial offering", "public", "listing"],
                "content": "An IPO (Initial Public Offering) is when a company first sells stock to the public. It allows companies to raise capital from public investors."
            },
            "Margin": {
                "keywords": ["margin", "borrowing", "leverage", "loan"],
                "content": "Margin is borrowing money to buy securities, using existing investments as collateral. It allows investors to increase their buying power but also increases risk."
            },
            "Short Selling": {
                "keywords": ["short selling", "betting down", "short", "borrow"],
                "content": "Short selling is selling borrowed stock in hopes of buying it back at a lower price. It is a strategy used when an investor expects a stock's price to decline."
            },
            "Market Order": {
                "keywords": ["market order", "instant buy/sell", "immediate", "current price"],
                "content": "A market order is an order to buy or sell a stock immediately at the best available price. It guarantees execution but not the price."
            },
            "Limit Order": {
                "keywords": ["limit order", "price control", "specific price", "target"],
                "content": "A limit order is an order to buy or sell at a specific price or better. It guarantees the price but not the execution."
            },
            "Stop Loss": {
                "keywords": ["stop loss", "risk management", "protection", "exit"],
                "content": "A stop loss is an order placed to sell a security when it reaches a certain price to limit loss. It helps protect against significant losses."
            },
            "Support Level": {
                "keywords": ["support level", "floor", "bottom", "demand"],
                "content": "A support level is a price level where a stock tends to stop falling and may bounce back up. It represents a concentration of demand."
            },
            "Resistance Level": {
                "keywords": ["resistance level", "ceiling", "top", "supply"],
                "content": "A resistance level is a price level where a stock tends to stop rising and may fall back. It represents a concentration of supply."
            },
            "Fundamental Analysis": {
                "keywords": ["fundamental analysis", "value-based", "financials", "company", "intrinsic value"],
                "content": "Fundamental analysis involves analyzing a company's financials, industry position, and economic factors to determine its intrinsic value. It includes examining financial statements, management quality, competitive advantages, and market conditions to make investment decisions."
            },
            "Technical Analysis": {
                "keywords": ["technical analysis", "chart-based", "price", "patterns", "trends"],
                "content": "Technical analysis is the study of price movements and trading volume using charts and patterns to predict future price behavior. It focuses on historical price data, trading volume, and market indicators rather than company fundamentals."
            },
            "Quantitative Analysis": {
                "keywords": ["quantitative analysis", "data-driven", "mathematical", "statistical", "models"],
                "content": "Quantitative analysis uses mathematical and statistical models to evaluate investments. It involves analyzing numerical data to identify patterns, relationships, and potential investment opportunities."
            },
            "Qualitative Analysis": {
                "keywords": ["qualitative analysis", "non-numeric", "intangible", "management", "brand"],
                "content": "Qualitative analysis assesses intangible factors like management quality, brand strength, market position, and company culture. It complements quantitative analysis by considering non-financial aspects of a company."
            },
            "SWOT Analysis": {
                "keywords": ["swot analysis", "strategic review", "strengths", "weaknesses", "opportunities", "threats"],
                "content": "SWOT Analysis is a framework for analyzing a company's Strengths, Weaknesses, Opportunities, and Threats. It helps investors understand a company's competitive position and potential future performance."
            },
            "PEG Ratio": {
                "keywords": ["peg ratio", "growth valuation", "price earnings growth", "growth adjusted"],
                "content": "The PEG (Price/Earnings to Growth) ratio evaluates a company's valuation while considering its earnings growth rate. It provides a more complete picture than the P/E ratio alone by factoring in growth potential."
            },
            "Price-to-Book Ratio": {
                "keywords": ["price to book ratio", "asset valuation", "book value", "p/b ratio"],
                "content": "The Price-to-Book ratio compares a company's market value to its book value. It helps investors identify potentially undervalued stocks by comparing market price to the company's net asset value."
            },
            "EV/EBITDA": {
                "keywords": ["ev/ebitda", "enterprise valuation", "enterprise value", "ebitda multiple"],
                "content": "EV/EBITDA compares a company's enterprise value to its EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization). It's commonly used in mergers and acquisitions to evaluate company value."
            },
            "DCF": {
                "keywords": ["dcf", "discounted cash flow", "intrinsic valuation", "future cash flows", "time value"],
                "content": "DCF (Discounted Cash Flow) is a method to estimate an investment's value based on its future cash flows, adjusted for the time value of money. It's considered one of the most thorough methods of valuation."
            },
            "Moving Average": {
                "keywords": ["moving average", "trend filter", "ma", "smoothing", "trend"],
                "content": "A Moving Average is a technical indicator that smooths price data by averaging it over a set time period. It helps identify trends by filtering out short-term price fluctuations."
            },
            "RSI": {
                "keywords": ["rsi", "relative strength index", "momentum", "oscillator", "overbought", "oversold"],
                "content": "The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. It helps identify overbought or oversold conditions in a security."
            },
            "MACD": {
                "keywords": ["macd", "moving average convergence divergence", "trend momentum", "signal line", "histogram"],
                "content": "MACD (Moving Average Convergence Divergence) is a trend-following momentum indicator that shows the relationship between two moving averages. It's used to spot changes in trend direction and strength."
            },
            "Volume": {
                "keywords": ["volume", "trading activity", "liquidity", "market activity", "trading volume"],
                "content": "Volume represents the number of shares or contracts traded in a security or market during a given period. It's a key indicator of market activity and liquidity."
            },
            "Support Level": {
                "keywords": ["support level", "price floor", "demand", "bottom", "bounce"],
                "content": "A Support Level is a price level where a stock tends to find buying interest and stops falling. It represents a concentration of demand that prevents the price from declining further."
            },
            "Resistance Level": {
                "keywords": ["resistance level", "price ceiling", "supply", "top", "reversal"],
                "content": "A Resistance Level is a price level where a stock tends to find selling interest and stops rising. It represents a concentration of supply that prevents the price from increasing further."
            },
            "Fibonacci Retracement": {
                "keywords": ["fibonacci retracement", "pullback tool", "fib levels", "retracement levels", "golden ratio"],
                "content": "Fibonacci Retracement is a technical analysis tool used to identify potential support and resistance levels. It's based on the Fibonacci sequence and is commonly used to predict price reversals."
            },
            "Trendline": {
                "keywords": ["trendline", "direction guide", "trend", "channel", "slope"],
                "content": "A Trendline is a line drawn on a chart to indicate the general direction of price movement. It helps identify the prevailing trend and potential support or resistance levels."
            },
            "Breakout": {
                "keywords": ["breakout", "trend shift", "breakthrough", "resistance", "support"],
                "content": "A Breakout occurs when a stock's price moves outside a defined support or resistance level with increased volume. It often signals the start of a new trend."
            },
            "Sentiment Analysis": {
                "keywords": ["sentiment analysis", "market mood", "investor sentiment", "market psychology", "emotions"],
                "content": "Sentiment Analysis involves evaluating market emotions and psychology based on news, reports, and trading behavior. It helps gauge overall market mood and potential price movements."
            },
            "Inflation": {
                "keywords": ["inflation", "price rise", "cost", "purchasing power"],
                "content": "Inflation is the rate at which the general level of prices for goods and services is rising. It erodes purchasing power over time."
            },
            "Deflation": {
                "keywords": ["deflation", "price drop", "decrease", "falling prices"],
                "content": "Deflation is a decrease in the general price levels of goods and services. It can lead to reduced economic activity and increased unemployment."
            },
            "Hedge": {
                "keywords": ["hedge", "protection", "insurance", "risk reduction"],
                "content": "A hedge is an investment made to reduce the risk of adverse price movements in an asset. It typically involves taking an offsetting position in a related security."
            },
            "Arbitrage": {
                "keywords": ["arbitrage", "price gap", "profit", "inefficiency"],
                "content": "Arbitrage is the simultaneous buying and selling of an asset to profit from price differences. It takes advantage of market inefficiencies."
            },
            "Day Trading": {
                "keywords": ["day trading", "quick trades", "intraday", "same day"],
                "content": "Day trading is buying and selling securities within the same trading day. It requires quick decision-making and carries high risk."
            },
            "Swing Trading": {
                "keywords": ["swing trading", "short-term hold", "trend", "momentum"],
                "content": "Swing trading is a strategy to capture short- to medium-term gains in a stock. It typically involves holding positions for several days to weeks."
            },
            "Portfolio": {
                "keywords": ["portfolio", "investment portfolio", "holdings", "assets", "investments"],
                "content": "A portfolio is a collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents, including closed-end funds and exchange-traded funds (ETFs). Portfolios are held directly by investors and/or managed by financial professionals."
            },
            "Portfolio Management": {
                "keywords": ["portfolio management", "asset management", "investment management", "wealth management"],
                "content": "Portfolio management involves selecting and overseeing a group of investments that meet the long-term financial objectives and risk tolerance of a client, company, or institution. It includes asset allocation, diversification, and regular rebalancing."
            },
            "Portfolio Diversification": {
                "keywords": ["diversification", "portfolio diversification", "risk management", "asset allocation"],
                "content": "Portfolio diversification is a risk management strategy that mixes a wide variety of investments within a portfolio. It aims to maximize returns by investing in different areas that would each react differently to the same event."
            },
            "Portfolio Rebalancing": {
                "keywords": ["rebalancing", "portfolio rebalancing", "asset allocation", "investment strategy"],
                "content": "Portfolio rebalancing is the process of realigning the weightings of a portfolio of assets by periodically buying or selling assets to maintain the original desired level of asset allocation and risk."
            },
            "Portfolio Risk": {
                "keywords": ["portfolio risk", "investment risk", "market risk", "systematic risk", "unsystematic risk"],
                "content": "Portfolio risk refers to the possibility that an investment portfolio will not achieve its expected return. It includes systematic risk (market-wide) and unsystematic risk (specific to individual investments)."
            },
            "Portfolio Return": {
                "keywords": ["portfolio return", "investment return", "total return", "performance"],
                "content": "Portfolio return is the gain or loss on a portfolio of investments over a specific period. It includes capital gains, dividends, and interest, and is typically expressed as a percentage of the portfolio's initial value."
            },
            "Portfolio Optimization": {
                "keywords": ["portfolio optimization", "efficient frontier", "modern portfolio theory", "risk-return tradeoff"],
                "content": "Portfolio optimization is the process of selecting the best portfolio (asset distribution) out of the set of all portfolios being considered, according to some objective. It typically involves maximizing expected return for a given level of risk."
            },
            "Portfolio Tracking": {
                "keywords": ["portfolio tracking", "performance tracking", "investment monitoring", "portfolio analysis"],
                "content": "Portfolio tracking involves monitoring and analyzing the performance of investments in a portfolio. It includes tracking returns, comparing against benchmarks, and assessing risk metrics."
            },
            "Portfolio Construction": {
                "keywords": ["portfolio construction", "investment strategy", "asset selection", "portfolio building"],
                "content": "Portfolio construction is the process of determining what mix of assets to include in a portfolio. It involves selecting investments based on goals, risk tolerance, and time horizon."
            },
            "Sharpe Ratio": {
                "keywords": ["sharpe ratio", "risk-adjusted return", "performance", "efficiency"],
                "content": "The Sharpe ratio is a measure of return per unit of risk taken. It helps investors understand the return of an investment compared to its risk."
            },
            "Market Sentiment": {
                "keywords": ["market sentiment", "investor mood", "attitude", "feeling"],
                "content": "Market sentiment is the overall attitude of investors toward a particular market or asset. It can influence price movements and market trends."
            },
            "Volatility Index (VIX)": {
                "keywords": ["vix", "volatility index", "fear gauge", "market fear"],
                "content": "The VIX (Volatility Index) is an index measuring market expectations of near-term volatility. It is often called the 'fear gauge' of the market."
            },
            "Leverage": {
                "keywords": ["leverage", "amplification", "borrowing", "multiplier"],
                "content": "Leverage is using borrowed capital to increase potential return on investment. It can amplify both gains and losses."
            },
            "Time Horizon": {
                "keywords": ["time horizon", "investment duration", "period", "term"],
                "content": "Time horizon is the expected time an investor plans to hold an investment. It helps determine appropriate investment strategies and risk levels."
            },
            "NSE": {
                "keywords": ["nse", "national stock exchange"],
                "content": "The National Stock Exchange (NSE) is India's leading stock exchange, headquartered in Mumbai. It's the world's largest derivatives exchange by trading volume and offers trading in equities, derivatives, debt instruments, and ETFs. The NSE's benchmark index is the NIFTY 50."
            },
            "BSE": {
                "keywords": ["bse", "bombay stock exchange", "Dalal Street", "dalal street"],
                "content": "The Bombay Stock Exchange (BSE) is Asia's oldest stock exchange, established in 1875. Located in Mumbai, India, it's one of the world's largest exchanges by market capitalization. Its benchmark index is the SENSEX, which tracks 30 of the largest and most actively traded stocks."
            },
            "NYSE": {
                "keywords": ["nyse", "new york stock exchange", "wall street"],
                "content": "The New York Stock Exchange (NYSE) is the world's largest stock exchange by market capitalization. Located on Wall Street in New York City, it's home to many of the world's largest companies. The NYSE's benchmark index is the Dow Jones Industrial Average (DJIA)."
            },
            "NASDAQ": {
                "keywords": ["nasdaq", "national association of securities dealers automated quotations"],
                "content": "NASDAQ is the second-largest stock exchange in the world by market capitalization. Known for its technology-focused companies, it was the world's first electronic stock market. Its benchmark index is the NASDAQ Composite, which includes over 3,000 stocks."
            },
            "LSE": {
                "keywords": ["lse", "london stock exchange"],
                "content": "The London Stock Exchange (LSE) is one of the world's oldest stock exchanges, established in 1801. It's the primary stock exchange in the United Kingdom and its benchmark index is the FTSE 100, which tracks the 100 largest companies listed on the LSE."
            },
            "TSE": {
                "keywords": ["tse", "tokyo stock exchange"],
                "content": "The Tokyo Stock Exchange (TSE) is Japan's largest stock exchange and one of the largest in Asia. Its benchmark index is the Nikkei 225, which tracks 225 large, publicly owned companies in Japan."
            },
            "SSE": {
                "keywords": ["sse", "shanghai stock exchange", "china", "asia", "sse composite"],
                "content": "The Shanghai Stock Exchange (SSE) is one of China's two major stock exchanges. It's the world's third-largest stock exchange by market capitalization. The SSE operates under strict government oversight and has unique features like circuit breakers and daily price limits. Its benchmark index is the SSE Composite Index."
            },
            "SZSE": {
                "keywords": ["szse", "shenzhen stock exchange"],
                "content": "The Shenzhen Stock Exchange (SZSE) is China's second major stock exchange. It focuses on innovative and high-growth companies. Its benchmark index is the SZSE Component Index."
            },
            "HKEX": {
                "keywords": ["hkex", "hong kong stock exchange"],
                "content": "The Hong Kong Stock Exchange (HKEX) is one of the largest stock exchanges in Asia. It's a major gateway for international investment into China. Its benchmark index is the Hang Seng Index."
            },
            "Euronext": {
                "keywords": ["euronext"],
                "content": "Euronext is a pan-European stock exchange operating in Amsterdam, Brussels, Dublin, Lisbon, Milan, Oslo, and Paris. It's the largest stock exchange in Europe and its benchmark index is the Euronext 100."
            },
            "TSX": {
                "keywords": ["tsx", "toronto stock exchange"],
                "content": "The Toronto Stock Exchange (TSX) is Canada's largest stock exchange and the third-largest in North America. Its benchmark index is the S&P/TSX Composite Index."
            },
            "ASX": {
                "keywords": ["asx", "australian securities exchange"],
                "content": "The Australian Securities Exchange (ASX) is Australia's primary stock exchange. It's one of the world's top 15 exchanges by market capitalization. Its benchmark index is the S&P/ASX 200."
            },
            "KRX": {
                "keywords": ["krx", "korea exchange"],
                "content": "The Korea Exchange (KRX) is South Korea's sole securities exchange operator. It's one of the largest exchanges in Asia. Its benchmark index is the KOSPI."
            },
            "SGX": {
                "keywords": ["sgx", "singapore exchange"],
                "content": "The Singapore Exchange (SGX) is Singapore's primary stock exchange. It's one of Asia's leading financial centers. Its benchmark index is the Straits Times Index (STI)."
            },
            "B3": {
                "keywords": ["b3", "brasil bolsa balcão"],
                "content": "B3 (Brasil, Bolsa, Balcão) is Brazil's main stock exchange. It's the largest exchange in Latin America. Its benchmark index is the IBOVESPA."
            },
            "S&P 500": {
                "keywords": ["s&p 500", "sp500", "standard & poor's", "us index", "large cap"],
                "content": "The S&P 500 is a stock market index tracking the performance of 500 large companies listed on stock exchanges in the United States. It is widely regarded as the best single gauge of large-cap U.S. equities and represents about 80% of the total U.S. stock market capitalization."
            },
            "Dow Jones": {
                "keywords": ["dow jones", "dow", "djia", "industrial average", "blue chip"],
                "content": "The Dow Jones Industrial Average (DJIA) is a price-weighted index of 30 prominent U.S. companies. It's one of the oldest and most widely followed stock market indices, representing blue-chip companies across various industries."
            },
            "NASDAQ Composite": {
                "keywords": ["nasdaq composite", "nasdaq", "tech index", "growth stocks"],
                "content": "The NASDAQ Composite is a market-capitalization-weighted index of more than 3,000 stocks listed on the NASDAQ stock exchange. It's heavily weighted towards technology companies and includes both domestic and international firms."
            },
            "NIFTY 50": {
                "keywords": ["nifty 50", "nifty", "india index", "nse index"],
                "content": "The NIFTY 50 is the flagship index of the National Stock Exchange of India, representing 50 of the largest and most liquid Indian companies. It covers 13 sectors of the Indian economy and is widely used as a benchmark for Indian equity markets."
            },
            "SENSEX": {
                "keywords": ["sensex", "bse index", "bombay index", "india 30"],
                "content": "The SENSEX is a free-float market-weighted stock market index of 30 well-established and financially sound companies listed on the Bombay Stock Exchange. It's India's oldest stock index and serves as a barometer of the Indian economy."
            },
            "FTSE 100": {
                "keywords": ["ftse 100", "footsie", "uk index", "london index"],
                "content": "The FTSE 100 Index is a share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization. It represents about 80% of the total market capitalization of the London Stock Exchange."
            },
            "DAX": {
                "keywords": ["dax", "germany index", "frankfurt index", "european index"],
                "content": "The DAX is a stock market index consisting of the 40 major German companies trading on the Frankfurt Stock Exchange. It's considered a benchmark for the German economy and one of the most important indices in Europe."
            },
            "CAC 40": {
                "keywords": ["cac 40", "france index", "paris index", "european stocks"],
                "content": "The CAC 40 is a benchmark French stock market index that represents a capitalization-weighted measure of the 40 most significant stocks listed on Euronext Paris. It's the main indicator of the French stock market."
            },
            "Nikkei 225": {
                "keywords": ["nikkei 225", "nikkei", "japan index", "tokyo index"],
                "content": "The Nikkei 225 is a stock market index for the Tokyo Stock Exchange, tracking 225 large Japanese companies. It's the most widely quoted average of Japanese equities and is price-weighted, similar to the Dow Jones Industrial Average."
            },
            "Hang Seng": {
                "keywords": ["hang seng", "hong kong index", "china index", "asia index"],
                "content": "The Hang Seng Index is a free-float capitalization-weighted index of the largest companies that trade on the Hong Kong Stock Exchange. It's the main indicator of the Hong Kong stock market and includes companies from mainland China."
            },
            "Shanghai Composite": {
                "keywords": ["shanghai composite", "china index", "sse index", "emerging markets"],
                "content": "The Shanghai Composite Index is a stock market index of all stocks that are traded at the Shanghai Stock Exchange. It's a key indicator of the Chinese stock market and includes both A-shares and B-shares."
            },
            "KOSPI": {
                "keywords": ["kospi", "korea index", "south korea index", "seoul index"],
                "content": "The KOSPI is the index of all common stocks traded on the Korea Exchange. It's the representative stock market index of South Korea and includes all common stocks listed on the exchange."
            },
            "S&P/ASX 200": {
                "keywords": ["asx 200", "australia index", "sydney index", "pacific index"],
                "content": "The S&P/ASX 200 is a market-capitalization weighted and float-adjusted stock market index of stocks listed on the Australian Securities Exchange. It's the benchmark index for Australian equity performance."
            },
            "IBOVESPA": {
                "keywords": ["ibovespa", "brazil index", "sao paulo index", "latin america"],
                "content": "The IBOVESPA is the benchmark index of about 90 stocks that are traded on the B3 (Brasil, Bolsa, Balcão). It's the main indicator of the average performance of the Brazilian stock market."
            },
            "MSCI World": {
                "keywords": ["msci world", "global index", "developed markets", "international"],
                "content": "The MSCI World Index is a market-capitalization-weighted index that includes large and mid-cap stocks across 23 developed market countries. It's a widely used benchmark for global equity performance."
            },
            "MSCI Emerging Markets": {
                "keywords": ["msci emerging markets", "emerging markets", "developing countries", "global growth"],
                "content": "The MSCI Emerging Markets Index is a free-float weighted equity index that includes large and mid-cap stocks from 24 emerging market countries. It's a key benchmark for emerging market equities."
            },
            "Russell 2000": {
                "keywords": ["russell 2000", "small cap", "us small cap", "growth stocks"],
                "content": "The Russell 2000 Index is a small-cap stock market index that makes up the smallest 2,000 stocks in the Russell 3000 Index. It's widely regarded as a benchmark for small-cap U.S. stocks."
            },
            "S&P/TSX Composite": {
                "keywords": ["tsx composite", "canada index", "toronto index", "north america"],
                "content": "The S&P/TSX Composite Index is the benchmark Canadian index, representing roughly 70% of the total market capitalization on the Toronto Stock Exchange. It includes companies from various sectors of the Canadian economy."
            },
            "Drawdown": {
                "keywords": ["drawdown", "peak to trough", "decline", "loss", "maximum drawdown", "mdd"],
                "content": "A drawdown is the peak-to-trough decline during a specific period for an investment, trading account, or fund. It measures the largest percentage drop in value from a peak to a subsequent low. Maximum Drawdown (MDD) is the largest observed loss from a peak to a trough before a new peak is attained. Drawdowns are important risk metrics that help investors understand the potential downside risk of an investment."
            },
            "SIP": {
                "keywords": ["sip", "systematic investment plan", "monthly investment", "regular investment", "periodic investment"],
                "content": "A Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly (usually monthly) in mutual funds or stocks. SIP is ideal when:\n\n1. You have a regular income\n2. Want to build wealth over the long term\n3. Want to benefit from market volatility through rupee cost averaging\n4. Cannot invest large amounts at once\n5. Want to develop a disciplined savings habit\n\nSIP works best during volatile markets as it helps average out your purchase cost over time (rupee cost averaging)."
            },
            "Lumpsum": {
                "keywords": ["lumpsum", "one-time investment", "bulk investment", "single payment", "one shot"],
                "content": "A Lumpsum investment is when you invest a large amount of money all at once. Lumpsum investment is suitable when:\n\n1. You have a large amount of money available (like bonus, inheritance, etc.)\n2. Markets are at a low point or undervalued\n3. You have a good understanding of market cycles\n4. You can tolerate higher short-term volatility\n5. You want to maximize returns in a rising market\n\nLumpsum investments can give better returns than SIP if market timing is right, but they carry higher risk due to market volatility."
            },
            "SIP vs Lumpsum": {
                "keywords": ["sip vs lumpsum", "compare sip lumpsum", "better investment option", "sip or lumpsum", "investment choice"],
                "content": "Choosing between SIP and Lumpsum depends on several factors:\n\n1. Market Conditions:\n   - SIP: Better in volatile or overvalued markets\n   - Lumpsum: Better in undervalued markets or at market bottom\n\n2. Investment Amount:\n   - SIP: For regular income earners with monthly savings\n   - Lumpsum: For large one-time amounts like bonus or inheritance\n\n3. Risk Tolerance:\n   - SIP: Lower risk due to rupee cost averaging\n   - Lumpsum: Higher risk due to market timing\n\n4. Investment Horizon:\n   - SIP: Better for long-term goals and wealth building\n   - Lumpsum: Can be used for both short and long-term goals\n\n5. Market Knowledge:\n   - SIP: Requires less market expertise\n   - Lumpsum: Requires good understanding of market cycles"
            }
        }

    def get_definition(self, term: str) -> Optional[str]:
        """Get the definition for a term if it exists in the knowledge base."""
        term = term.lower()
        for key, data in self.definitions.items():
            if term in data['keywords'] or term in key.lower():
                return data['content']
        return None 