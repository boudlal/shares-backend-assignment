import { StockPriceType, CompaniesStockPricesType } from "../types/StockPriceTypes";
import { CompanyEnum, TradeActionEnum, TradeType } from "../types/TradeTypes";

/**
 * Iterate over days, and return an array of trades
 *
 * @param {number} capital initial capital
 * @param {Record<CompanyEnum, StockPriceType[]>} prices prices of google and amazon
 * @return {number} an array of trades
 */

export const runSimulation = (capital: number, prices: Record<CompanyEnum, StockPriceType[]>): TradeType[] => {
    return [];
};

/**
 * Get next trades after evaluating multiple trade cases
 *
 * @param {number} initialCapital The initial capital
 * @param {TradeType} previousTrade The previous trade made
 * @param {Record<CompanyEnum, StockPriceType[]>} prices Prices of all stocks
 * @param {number} currentDay Current Day
 * @return {{TradeType[], expectedProfit}} Array of next trades and expected profit in case of holding
 */

export const getNextTrades = (
    previousTrade: TradeType,
    initialCapital: number,
    prices: CompaniesStockPricesType,
    currentDay: number,
): {
    trades: TradeType[];
    expectedProfit: number;
} => {
    const nextTrades: TradeType[] = [];
    let nextExpectedProfit: number = null;

    if (previousTrade?.action !== TradeActionEnum.BUY) {
        const nextTrade = getBuyTrade(previousTrade, initialCapital, prices, currentDay);
        if (nextTrade) {
            nextTrades.push(nextTrade);
        }

        return {
            trades: nextTrades,
            expectedProfit: nextTrade?.expectedProfit,
        };
    }

    // get profit of trading the other stock
    const companies = Object.values(CompanyEnum);
    const expectedCapitalAfterSell = previousTrade.total + previousTrade.expectedProfit + previousTrade.totalWallet;
    const unboughtCompanies = companies.filter((x) => x !== previousTrade.name);

    const nextTrade = getBestTradeInMarket(unboughtCompanies, expectedCapitalAfterSell, prices, currentDay);

    const { trade, expectedProfit } = getHoldOrSellTrade(previousTrade, prices, currentDay);

    nextExpectedProfit = expectedProfit;
    if (trade) {
        nextTrades.push(trade);
        if (nextTrade) nextTrades.push(nextTrade);
    }

    if (nextTrade?.expectedProfit > nextExpectedProfit) {
        const unitPrice = prices[previousTrade.name][currentDay].highestPriceOfTheDay;
        const totalShares = previousTrade.totalShares;
        const total = unitPrice * totalShares;
        const totalWallet = previousTrade.totalWallet + total;

        const sellTrade: TradeType = {
            name: previousTrade.name,
            expectedProfit: null,
            action: TradeActionEnum.SELL,
            date: new Date(prices[previousTrade.name][currentDay].timestamp),
            unitPrice,
            total,
            totalShares,
            totalWallet,
        };
        nextTrades.push(sellTrade);

        nextExpectedProfit = nextTrade.expectedProfit;
        nextTrades.push(nextTrade);
    }

    return {
        trades: nextTrades,
        expectedProfit: nextExpectedProfit,
    };
};

/**
 * Get Next Buy Trade after calculating the current capital
 *
 * @param {TradeType} previousTrade The previous trade made
 * @param {number} initialCapital The initial capital
 * @param {Record<CompanyEnum, StockPriceType[]>} prices Prices of all stocks
 * @param {number} currentDay Current Day
 * @return {TradeType | null} The buy trade or null
 */

export const getBuyTrade = (
    previousTrade: TradeType,
    initialCapital: number,
    prices: CompaniesStockPricesType,
    currentDay: number,
): TradeType | null => {
    const companies = Object.values(CompanyEnum);

    let capital = initialCapital;
    if (previousTrade?.action === TradeActionEnum.SELL) {
        capital = previousTrade.totalWallet;
    }

    const nextTrade = getBestTradeInMarket(companies, capital, prices, currentDay);

    return nextTrade;
};

/**
 * Compare the profit of holding until next day and the profit of selling today
 *
 * @param {TradeType} previousTrade The previous trade made
 * @param {Record<CompanyEnum, StockPriceType[]>} prices Prices of all stocks
 * @param {number} currentDay Current Day
 * @return {{TradeType, expectedProfit}} the sell trade if exists and the expected profit
 */

export const getHoldOrSellTrade = (
    previousTrade: TradeType,
    prices: CompaniesStockPricesType,
    currentDay: number,
): {
    trade: TradeType | null;
    expectedProfit: number;
} => {
    const holdingProfit = getNextDayProfit(
        previousTrade.total,
        previousTrade.unitPrice,
        prices[previousTrade.name][currentDay + 1]?.highestPriceOfTheDay,
    );

    if (holdingProfit.expectedProfit < previousTrade.expectedProfit) {
        const unitPrice = prices[previousTrade.name][currentDay].highestPriceOfTheDay;
        const totalShares = previousTrade.totalShares;
        const total = unitPrice * totalShares;
        const totalWallet = previousTrade.totalWallet + total;

        const sellTrade: TradeType = {
            name: previousTrade.name,
            expectedProfit: null,
            action: TradeActionEnum.SELL,
            date: new Date(prices[previousTrade.name][currentDay].timestamp),
            unitPrice,
            total,
            totalShares,
            totalWallet,
        };

        return { trade: sellTrade, expectedProfit: sellTrade.expectedProfit };
    } else {
        return {
            trade: null,
            expectedProfit: holdingProfit.expectedProfit,
        };
    }
};

/**
 * iterate over the provided companies stocks and compare the profit of buying in day 0 and selling in day 1
 *
 * @param {CompanyEnum[]} companies companies to compare
 * @param {number} capital The current capital
 * @param {Record<CompanyEnum, StockPriceType[]>} prices Prices of all stocks
 * @param {number} currentDay Current Day
 * @return {TradeType} the best trade
 */

export const getBestTradeInMarket = (
    companies: CompanyEnum[],
    capital: number,
    prices: CompaniesStockPricesType,
    currentDay: number,
): TradeType => {
    let trade: TradeType = null;

    if (capital <= 0 || currentDay + 1 === prices.amazon.length) return null;

    for (let i = 0; i < companies.length; i++) {
        const currentCompany = companies[i];
        const currentPrice = prices[currentCompany][currentDay];
        const nextPrice = prices[currentCompany][currentDay + 1];

        // get profit of buying the stock today and selling it tomorrow
        const { expectedProfit, total, unitPrice, totalShares, totalWallet } = getNextDayProfit(
            capital,
            currentPrice.lowestPriceOfTheDay,
            nextPrice.highestPriceOfTheDay,
        );

        // compare profits per stock and return the best trade
        if (expectedProfit > 0 && (!trade || expectedProfit > trade?.expectedProfit)) {
            trade = {
                expectedProfit,
                name: currentCompany,
                total,
                totalShares,
                totalWallet,
                unitPrice,
                date: new Date(currentPrice.timestamp),
                action: TradeActionEnum.BUY,
            };
        }
    }

    return trade;
};

/**
 * calculate the profit of buying in day 0 and selling in day 1
 *
 * @param {number} capital The current capital
 * @param {number} buyPrice Buy Price
 * @param {number} sellPrice Sell Price
 * @return {Pick<TradeType, "expectedProfit" | "totalShares" | "totalWallet" | "total" | "unitPrice">} The calculated amounts of the trade
 */

export const getNextDayProfit = (
    capital: number,
    buyPrice: number,
    sellPrice: number,
): Pick<TradeType, "expectedProfit" | "totalShares" | "totalWallet" | "total" | "unitPrice"> => {
    const totalShares = Math.floor(capital / buyPrice);
    const total = totalShares * buyPrice;
    const totalWallet = capital - total;

    const expectedProfit = totalShares * sellPrice - total;

    return { expectedProfit, totalShares, totalWallet, total, unitPrice: buyPrice };
};
