import { calculateNextDayProfit, formatSellTrade } from "../helpers/simulation";
import { StockPriceType, CompaniesStockPricesType } from "../types/StockPriceTypes";
import { CompanyEnum, TradeActionEnum, TradeType } from "../types/TradeTypes";

/**
 * Iterate over days, and return an array of trades
 *
 * @param {number} capital initial capital
 * @param {CompaniesStockPricesType} prices prices of google and amazon
 * @return {number} an array of trades
 */

export const runSimulation = (capital: number, prices: CompaniesStockPricesType): TradeType[] => {
    if (capital === 0) return [];
    let trades: TradeType[] = [];

    const totalDays = prices.amazon.length;
    for (let i = 0; i < totalDays; i++) {
        const currentTrade = trades[trades.length - 1] || null;

        // check if it's the last day
        if (i + 1 === totalDays) {
            const finalTrade = getFinalTrade(currentTrade, prices[currentTrade.name][i]);
            if (finalTrade) trades.push(finalTrade);

            continue;
        }

        const result = getNextTrades(currentTrade, capital, prices, i);
        if (result.trades.length === 0 && result.expectedProfit > 0) {
            currentTrade.expectedProfit = result.expectedProfit;
        }

        trades = trades.concat(result.trades);
    }

    return trades;
};

/**
 * Get Final Trade if a buy trade already exists
 *
 * @param {TradeType} previousTrade the previous trade made
 * @param {StockPriceType} currentPrice Price of the previous stock bought at the current day
 * @return {TradeType | null} the final trade or null
 */

export const getFinalTrade = (previousTrade: TradeType, currentPrice: StockPriceType): TradeType | null => {
    if (previousTrade?.action === TradeActionEnum.BUY) {
        const sellTrade = formatSellTrade(previousTrade, currentPrice);
        return sellTrade;
    }

    return null;
};

/**
 * Get Next Buy Trade after calculating the current capital
 *
 * @param {TradeType} previousTrade The previous trade made
 * @param {number} initialCapital The initial capital
 * @param {CompaniesStockPricesType} prices Prices of all stocks
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
 * Get next trades after evaluating multiple trade cases
 *
 * @param {number} initialCapital The initial capital
 * @param {TradeType} previousTrade The previous trade made
 * @param {CompaniesStockPricesType} prices Prices of all stocks
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

    const buyTrade = getBestTradeInMarket(unboughtCompanies, expectedCapitalAfterSell, prices, currentDay);

    const { trade: sellTrade, expectedProfit } = getHoldOrSellTrade(previousTrade, prices, currentDay);
    nextExpectedProfit = expectedProfit;

    if (sellTrade) {
        nextTrades.push(sellTrade);
        if (buyTrade) nextTrades.push(buyTrade);
    } else if (buyTrade?.expectedProfit > nextExpectedProfit) {
        const sellTrade = formatSellTrade(previousTrade, prices[previousTrade.name][currentDay]);

        nextExpectedProfit = buyTrade.expectedProfit;
        nextTrades.push(sellTrade, buyTrade);
    }

    return {
        trades: nextTrades,
        expectedProfit: nextExpectedProfit,
    };
};

/**
 * Compare the profit of holding until next day and the profit of selling today
 *
 * @param {TradeType} previousTrade The previous trade made
 * @param {CompaniesStockPricesType} prices Prices of all stocks
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
    const holdingProfit = calculateNextDayProfit(
        previousTrade.total,
        previousTrade.unitPrice,
        prices[previousTrade.name][currentDay + 1]?.highestPriceOfTheDay,
    );

    if (holdingProfit.expectedProfit < previousTrade.expectedProfit) {
        const sellTrade = formatSellTrade(previousTrade, prices[previousTrade.name][currentDay]);

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
 * @param {CompaniesStockPricesType} prices Prices of all stocks
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

        const { expectedProfit, total, unitPrice, totalShares, totalWallet } = calculateNextDayProfit(
            capital,
            currentPrice.lowestPriceOfTheDay,
            nextPrice.highestPriceOfTheDay,
        );
        if (expectedProfit <= 0) continue;

        if (!trade || expectedProfit > trade.expectedProfit) {
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
