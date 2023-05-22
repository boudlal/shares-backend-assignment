import { StockPriceType } from "../types/StockPriceTypes";
import { CompanyEnum, TradeType } from "../types/TradeTypes";

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
    prices: Record<CompanyEnum, StockPriceType[]>,
    currentDay: number,
): {
    trades: TradeType[];
    expectedProfit: number | null;
} => {
    return {
        trades: [],
        expectedProfit: null,
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
    prices: Record<CompanyEnum, StockPriceType[]>,
    currentDay: number,
): TradeType | null => {
    return null;
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
    prices: Record<CompanyEnum, StockPriceType[]>,
    currentDay: number,
): {
    trade: TradeType | null;
    expectedProfit: number;
} => {
    return { trade: null, expectedProfit: null };
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
    prices: Record<CompanyEnum, StockPriceType[]>,
    currentDay: number,
): TradeType => {
    return null;
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
    return null;
};
