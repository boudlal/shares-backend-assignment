import { BestTradeInfoType, MonthsEnum, PriceInfoType } from "../types/StatsTypes";
import { StockPriceType } from "../types/StockPriceTypes";
import { CompanyEnum } from "../types/TradeTypes";
import { toFixed } from "./simulation";

/**
 * calculate and returns the monthly average
 * it start with calculating the average price of each day then it calculates the monthly average
 *
 * @param {StockPriceType} currentPrice The prices

 * @return {number} The average price
 */

export const calculateMonthlyAverage = (prices: StockPriceType[]): number => {
    if (prices.length === 0) return 0;

    const dailyAverages = [];
    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];
        dailyAverages.push((price.highestPriceOfTheDay + price.lowestPriceOfTheDay) / 2);
    }

    const sumDailyAverages = dailyAverages.reduce((a: number, b: number) => a + b, 0);
    const average = toFixed(sumDailyAverages / dailyAverages.length);

    return average;
};

/**
 * extract and return the month from a timestamp
 *
 * @param {number} timestamp timestamp

 * @return {MonthsEnum} the string representation of the month
 */

export const getMonthFromTimestamp = (number: number): MonthsEnum | undefined => {
    const date = new Date(number);
    if (isNaN(date.getTime())) return undefined;

    const months = Object.values(MonthsEnum);

    return months[date.getMonth()];
};

/**
 * return prices grouped by month
 *
 * @param {StockPriceType} currentPrice The prices

 * @return {MonthsEnum} the string representation of the month
 */

export const groupByMonth = (prices: StockPriceType[]): Record<MonthsEnum, StockPriceType[]> => {
    const groupedPrices = prices.reduce((result: Record<MonthsEnum, StockPriceType[]>, current: StockPriceType) => {
        const month = getMonthFromTimestamp(current.timestamp);

        if (!result[month]) {
            result[month] = [current];
        } else {
            result[month].push(current);
        }
        return result;
    }, {} as Record<MonthsEnum, StockPriceType[]>);

    return groupedPrices;
};

/**
 * init companies price info values
 *
 * @param {CompanyEnum[]} companies array of companies names

 * @return {Record<CompanyEnum, PriceInfoType>} object of companies priceInfo
 */

export const initCompaniesPriceInfo = (companies: CompanyEnum[]): Record<CompanyEnum, PriceInfoType> => {
    const result = {} as Record<CompanyEnum, PriceInfoType>;

    const priceInfoObject = { price: 0, timestamp: 0 };

    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        result[company] = priceInfoObject;
    }

    return result;
};

/**
 * calculate price info and profit
 *
 * @param {number} capital capital
 * @param {StockPriceType} price current price
 * @param {{ price: number; timestamp: number }} minPriceInfo old minimum price info to be compared
 * @param {{ price: number; timestamp: number }} maxPriceInfo old maximum price info to be compared

 * @return {BestTradeInfoType} profit & minPriceInfo & maxPriceInfo
 */

export const calculatePriceInfoAndProfit = (
    capital: number,
    price: StockPriceType,
    minPriceInfo: { price: number; timestamp: number },
    maxPriceInfo: { price: number; timestamp: number },
): BestTradeInfoType => {
    const { lowestPriceOfTheDay, highestPriceOfTheDay, timestamp } = price;

    if (!minPriceInfo.price || lowestPriceOfTheDay < minPriceInfo.price) {
        minPriceInfo = {
            price: lowestPriceOfTheDay,
            timestamp,
        };

        maxPriceInfo = {
            ...maxPriceInfo,
            price: 0,
        };
    }

    if (!maxPriceInfo.price || highestPriceOfTheDay > maxPriceInfo.price) {
        maxPriceInfo = {
            price: highestPriceOfTheDay,
            timestamp,
        };
    }

    const totalShares = toFixed(Math.floor(capital / minPriceInfo.price));
    const totalBuy = toFixed(totalShares * minPriceInfo.price);
    const totalSell = toFixed(totalShares * maxPriceInfo.price);
    const profit = toFixed(totalSell - totalBuy);

    return { profit, maxPriceInfo, minPriceInfo };
};
