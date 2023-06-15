import {
    calculatePriceInfoAndProfit,
    calculateMonthlyAverage,
    groupByMonth,
    initCompaniesPriceInfo,
} from "../helpers/stats";
import { AveragePerMonthType, BestTradeInfoType, MonthsEnum } from "../types/StatsTypes";
import { CompaniesStockPricesType } from "../types/StockPriceTypes";
import { CompanyEnum } from "../types/TradeTypes";

/**
 * Get average price of each month for each stock
 *
 * @param {CompaniesStockPricesType} prices prices of google and amazon

 * @return {Record<CompanyEnum, AveragePerMonthType[]>} average price for each month 
 */

export const getAveragePerMonth = (prices: CompaniesStockPricesType): Record<CompanyEnum, AveragePerMonthType[]> => {
    const groupedPrices = {
        [`${CompanyEnum.AMAZON}`]: groupByMonth(prices[CompanyEnum.AMAZON]),
        [`${CompanyEnum.GOOGLE}`]: groupByMonth(prices[CompanyEnum.GOOGLE]),
    };

    const months = Object.values(MonthsEnum);
    const result: Record<CompanyEnum, AveragePerMonthType[]> = {
        [CompanyEnum.AMAZON]: [],
        [CompanyEnum.GOOGLE]: [],
    };

    for (let i = 0; i < months.length; i++) {
        const month = months[i];
        if (groupedPrices.amazon[month]) {
            result.amazon.push({
                month,
                average: calculateMonthlyAverage(groupedPrices.amazon[month]),
            });
        }

        if (groupedPrices.google[month]) {
            result.google.push({
                month,
                average: calculateMonthlyAverage(groupedPrices.google[month]),
            });
        }
    }

    return result;
};

/**
 * Get average price of each month for each stock
 *
 * @param {number} capital capital
 * @param {CompaniesStockPricesType} prices prices of google and amazon

 * @return {Record<CompanyEnum, BestTradeInfoType> } best trade of google and amazon
 */

export const getBestTrade = (
    capital: number,
    prices: CompaniesStockPricesType,
): Record<CompanyEnum, BestTradeInfoType> => {
    const companies = Object.values(CompanyEnum);

    const finalResult = {
        [CompanyEnum.AMAZON]: null,
        [CompanyEnum.GOOGLE]: null,
    } as Record<CompanyEnum, BestTradeInfoType>;

    if (capital === 0) return finalResult;

    let maxProfit = 0;
    const minPriceInfo = initCompaniesPriceInfo(companies);
    const maxPriceInfo = initCompaniesPriceInfo(companies);

    const totalDays = prices.amazon.length;

    for (let i = 0; i < totalDays; i++) {
        for (let j = 0; j < companies.length; j++) {
            const company = companies[j];

            const result = calculatePriceInfoAndProfit(
                capital,
                prices[company][i],
                minPriceInfo[company],
                maxPriceInfo[company],
            );

            minPriceInfo[company] = result.minPriceInfo;
            maxPriceInfo[company] = result.maxPriceInfo;

            if (result.profit > maxProfit) {
                maxProfit = result.profit;
                finalResult[company] = result;
            }
        }
    }

    return finalResult;
};
