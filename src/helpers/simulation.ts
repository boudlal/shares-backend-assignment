import { StockPriceType } from "../types/StockPriceTypes";
import { TradeActionEnum, TradeType } from "../types/TradeTypes";

/**
 * calculate the profit of buying in day 0 and selling in day 1
 *
 * @param {number} capital The current capital
 * @param {number} buyPrice Buy Price
 * @param {number} sellPrice Sell Price
 * @return {Pick<TradeType, "expectedProfit" | "totalShares" | "totalWallet" | "total" | "unitPrice">} The calculated amounts of the trade
 */
export const calculateNextDayProfit = (
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

/**
 * calculate the profit of buying in day 0 and selling in day 1
 *
 * @param {TradeType} previousTrade The previous trade made
 * @param {StockPriceType} currentPrice The price the stock
 * @return {TradeType} The sell trade
 */

export const formatSellTrade = (previousTrade: TradeType, currentPrice: StockPriceType): TradeType | null => {
    if (!previousTrade || !currentPrice) return null;
    const unitPrice = currentPrice.highestPriceOfTheDay;
    const totalShares = previousTrade.totalShares;
    const total = unitPrice * totalShares;
    const totalWallet = previousTrade.totalWallet + total;

    return {
        name: previousTrade.name,
        action: TradeActionEnum.SELL,
        date: new Date(currentPrice.timestamp),
        unitPrice,
        totalShares,
        total,
        totalWallet,
        expectedProfit: null,
    };
};
