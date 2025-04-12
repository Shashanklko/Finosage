class KnowledgeBase:
    def __init__(self):
        self.definitions = {
            # Basic Investment Terms
            'stock': {
                'keywords': ['stock', 'stocks', 'what is a stock', 'define stock', 'stock definition', 'explain stock', 'tell me about stocks', 'stock market', 'share', 'shares', 'equity', 'equities', 'common stock', 'preferred stock'],
                'definition': 'A stock represents ownership in a company. When you buy a stock, you become a shareholder and own a small piece of that company. Stocks are traded on stock exchanges, and their prices fluctuate based on supply and demand. Stocks can provide returns through price appreciation and dividends.'
            },
            'bond': {
                'keywords': ['bond', 'bonds', 'what is a bond', 'define bond', 'bond definition', 'explain bond', 'tell me about bonds', 'fixed income', 'debt security', 'government bond', 'corporate bond', 'treasury bond', 'municipal bond'],
                'definition': 'A bond is a fixed-income instrument that represents a loan made by an investor to a borrower (typically corporate or governmental). Bonds are used by companies, municipalities, states, and sovereign governments to finance projects and operations. They typically pay periodic interest and return the principal at maturity.'
            },
            'mutual fund': {
                'keywords': ['mutual fund', 'mutual funds', 'what is a mutual fund', 'define mutual fund', 'mutual fund definition', 'explain mutual fund', 'tell me about mutual funds', 'fund', 'funds', 'investment fund', 'managed fund', 'open-end fund'],
                'definition': 'A mutual fund is an investment vehicle that pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. It is managed by professional portfolio managers. Mutual funds offer diversification and professional management, but typically charge management fees.'
            },
            'etf': {
                'keywords': ['etf', 'etfs', 'what is an etf', 'define etf', 'etf definition', 'explain etf', 'tell me about etfs', 'exchange traded fund', 'exchange traded funds', 'index fund', 'index etf', 'passive etf', 'active etf'],
                'definition': 'An ETF (Exchange-Traded Fund) is a type of investment fund that is traded on stock exchanges, much like stocks. ETFs hold assets such as stocks, commodities, or bonds and generally operate with an arbitrage mechanism designed to keep it trading close to its net asset value. They typically have lower fees than mutual funds.'
            },
            'index fund': {
                'keywords': ['index fund', 'index funds', 'what is an index fund', 'define index fund', 'index fund definition', 'explain index fund', 'tell me about index funds', 'passive fund', 'tracker fund', 'market index fund'],
                'definition': 'An index fund is a type of mutual fund or ETF that aims to replicate the performance of a specific market index, such as the S&P 500. Index funds offer broad market exposure, low operating expenses, and low portfolio turnover. They are a popular choice for passive investors.'
            },

            # Market Terms
            'bull market': {
                'keywords': ['bull market', 'what is a bull market', 'define bull market', 'bull market definition', 'explain bull market', 'tell me about bull markets', 'rising market', 'upward trend', 'market rally'],
                'definition': 'A bull market is a period of rising stock prices, typically by 20% or more from recent lows. It is characterized by optimism, investor confidence, and expectations of strong results. Bull markets are often associated with economic growth and positive investor sentiment.'
            },
            'bear market': {
                'keywords': ['bear market', 'what is a bear market', 'define bear market', 'bear market definition', 'explain bear market', 'tell me about bear markets', 'falling market', 'downward trend', 'market decline'],
                'definition': 'A bear market is a period of declining stock prices, typically by 20% or more from recent highs. It is characterized by pessimism, investor fear, and expectations of further losses. Bear markets are often associated with economic downturns and negative investor sentiment.'
            },
            'market capitalization': {
                'keywords': ['market capitalization', 'market cap', 'what is market capitalization', 'define market capitalization', 'market capitalization definition', 'explain market capitalization', 'tell me about market capitalization', 'company size', 'market value', 'stock value'],
                'definition': 'Market capitalization is the total dollar market value of a company\'s outstanding shares of stock. It is calculated by multiplying a company\'s shares outstanding by the current market price of one share. This figure is used to determine a company\'s size and is often used to compare companies within the same industry.'
            },
            'volatility': {
                'keywords': ['volatility', 'what is volatility', 'define volatility', 'volatility definition', 'explain volatility', 'tell me about volatility', 'market volatility', 'price volatility', 'stock volatility'],
                'definition': 'Volatility refers to the degree of variation in a trading price series over time. It is often measured by the standard deviation of returns. Higher volatility means higher risk, as prices can change dramatically in a short period of time.'
            },
            'liquidity': {
                'keywords': ['liquidity', 'what is liquidity', 'define liquidity', 'liquidity definition', 'explain liquidity', 'tell me about liquidity', 'market liquidity', 'asset liquidity', 'trading liquidity'],
                'definition': 'Liquidity refers to how quickly and easily an asset can be bought or sold without affecting its price. Highly liquid assets can be sold quickly with minimal price impact, while illiquid assets may take longer to sell and may require price concessions.'
            },

            # Investment Strategies
            'diversification': {
                'keywords': ['diversification', 'what is diversification', 'define diversification', 'diversification definition', 'explain diversification', 'tell me about diversification', 'investment diversification', 'portfolio diversification', 'diversified portfolio', 'spread risk'],
                'definition': 'Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio. The rationale behind this technique is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and lower the risk of any individual holding or security.'
            },
            'asset allocation': {
                'keywords': ['asset allocation', 'what is asset allocation', 'define asset allocation', 'asset allocation definition', 'explain asset allocation', 'tell me about asset allocation', 'investment allocation', 'portfolio allocation', 'investment mix', 'asset mix'],
                'definition': 'Asset allocation is an investment strategy that aims to balance risk and reward by apportioning a portfolio\'s assets according to an individual\'s goals, risk tolerance, and investment horizon. The three main asset classes - equities, fixed-income, and cash and equivalents - have different levels of risk and return.'
            },
            'dollar cost averaging': {
                'keywords': ['dollar cost averaging', 'what is dollar cost averaging', 'define dollar cost averaging', 'dollar cost averaging definition', 'explain dollar cost averaging', 'tell me about dollar cost averaging', 'dca', 'systematic investing'],
                'definition': 'Dollar cost averaging is an investment strategy where an investor divides up the total amount to be invested across periodic purchases of a target asset to reduce the impact of volatility on the overall purchase. This strategy helps reduce the risk of investing a large amount in a single investment at the wrong time.'
            },
            'value investing': {
                'keywords': ['value investing', 'what is value investing', 'define value investing', 'value investing definition', 'explain value investing', 'tell me about value investing', 'value stocks', 'undervalued stocks'],
                'definition': 'Value investing is an investment strategy that involves picking stocks that appear to be trading for less than their intrinsic or book value. Value investors actively seek stocks they believe the market has undervalued, with the expectation that the market will eventually recognize the company\'s true value.'
            },
            'growth investing': {
                'keywords': ['growth investing', 'what is growth investing', 'define growth investing', 'growth investing definition', 'explain growth investing', 'tell me about growth investing', 'growth stocks', 'high growth companies'],
                'definition': 'Growth investing is an investment strategy that focuses on stocks of companies that are expected to grow at an above-average rate compared to their industry or the overall market. Growth investors typically look for companies with strong earnings growth, high profit margins, and robust sales growth.'
            },

            # Risk Management
            'risk tolerance': {
                'keywords': ['risk tolerance', 'what is risk tolerance', 'define risk tolerance', 'risk tolerance definition', 'explain risk tolerance', 'tell me about risk tolerance', 'investment risk', 'risk appetite', 'risk capacity', 'risk profile'],
                'definition': 'Risk tolerance is the degree of variability in investment returns that an investor is willing to withstand. It is an important component in investing and varies from person to person based on factors like age, income, investment goals, and personal preferences. Understanding your risk tolerance helps in creating an appropriate investment strategy.'
            },
            'hedging': {
                'keywords': ['hedging', 'what is hedging', 'define hedging', 'hedging definition', 'explain hedging', 'tell me about hedging', 'investment hedge', 'risk hedge', 'portfolio hedge'],
                'definition': 'Hedging is an investment strategy used to reduce the risk of adverse price movements in an asset. It typically involves taking an offsetting position in a related security, such as a futures contract. Hedging helps protect against potential losses while still allowing for potential gains.'
            },
            'stop loss': {
                'keywords': ['stop loss', 'what is a stop loss', 'define stop loss', 'stop loss definition', 'explain stop loss', 'tell me about stop loss', 'stop order', 'stop limit', 'trailing stop'],
                'definition': 'A stop loss is an order placed with a broker to buy or sell a security when it reaches a certain price. It is designed to limit an investor\'s loss on a security position. Stop losses can help protect against significant losses in volatile markets.'
            },
            'risk reward ratio': {
                'keywords': ['risk reward ratio', 'what is risk reward ratio', 'define risk reward ratio', 'risk reward ratio definition', 'explain risk reward ratio', 'tell me about risk reward ratio', 'risk return ratio', 'reward to risk'],
                'definition': 'The risk-reward ratio is a measure used by investors to compare the expected returns of an investment to the amount of risk undertaken to capture these returns. It is calculated by dividing the amount of profit expected from a trade by the amount of risk taken.'
            },
            'beta': {
                'keywords': ['beta', 'what is beta', 'define beta', 'beta definition', 'explain beta', 'tell me about beta', 'stock beta', 'market beta', 'beta coefficient'],
                'definition': 'Beta is a measure of a stock\'s volatility in relation to the overall market. A beta of 1 indicates that the stock\'s price will move with the market. A beta less than 1 means the stock is less volatile than the market, while a beta greater than 1 means the stock is more volatile than the market.'
            },

            # Investment Types
            'blue chip': {
                'keywords': ['blue chip', 'blue chip stock', 'what is a blue chip', 'define blue chip', 'blue chip definition', 'explain blue chip', 'tell me about blue chips', 'large cap', 'established company'],
                'definition': 'Blue chip stocks are shares in large, well-established companies with a history of reliable performance. These companies are typically industry leaders, have strong balance sheets, and often pay regular dividends. They are considered relatively safe investments compared to smaller companies.'
            },
            'growth stock': {
                'keywords': ['growth stock', 'growth stocks', 'what is a growth stock', 'define growth stock', 'growth stock definition', 'explain growth stock', 'tell me about growth stocks', 'high growth', 'emerging company'],
                'definition': 'A growth stock is a share in a company that is expected to grow at an above-average rate compared to other companies in the market. These companies typically reinvest their earnings rather than pay dividends, focusing on expansion and innovation. They often operate in rapidly growing industries.'
            },
            'dividend stock': {
                'keywords': ['dividend stock', 'dividend stocks', 'what is a dividend stock', 'define dividend stock', 'dividend stock definition', 'explain dividend stock', 'tell me about dividend stocks', 'income stock', 'dividend paying stock'],
                'definition': 'A dividend stock is a stock that regularly pays dividends to its shareholders. These stocks are typically issued by well-established companies with stable earnings. Dividend stocks are popular among income-focused investors and can provide a steady stream of income.'
            },
            'penny stock': {
                'keywords': ['penny stock', 'penny stocks', 'what is a penny stock', 'define penny stock', 'penny stock definition', 'explain penny stock', 'tell me about penny stocks', 'micro cap', 'small cap stock'],
                'definition': 'A penny stock is a common stock that typically trades for less than $5 per share. These stocks are usually issued by small companies and trade on over-the-counter markets. Penny stocks are considered high-risk investments due to their low liquidity and high volatility.'
            },
            'reit': {
                'keywords': ['reit', 'reits', 'what is a reit', 'define reit', 'reit definition', 'explain reit', 'tell me about reits', 'real estate investment trust', 'property investment'],
                'definition': 'A REIT (Real Estate Investment Trust) is a company that owns, operates, or finances income-producing real estate. REITs provide a way for individual investors to earn a share of the income produced through commercial real estate ownership without actually having to buy, manage, or finance any properties themselves.'
            }
        }

    def get_definition(self, term):
        term = term.lower().strip()
        
        # First try exact match in keywords
        for key, value in self.definitions.items():
            if term in value['keywords']:
                return value['definition']
        
        # Then try partial matches
        for key, value in self.definitions.items():
            if any(term in keyword for keyword in value['keywords']):
                return value['definition']
        
        # Finally try if the term is a substring of any keyword
        for key, value in self.definitions.items():
            if any(term in keyword for keyword in value['keywords']):
                return value['definition']
        
        return None 