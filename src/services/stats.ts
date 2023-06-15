import { calculateMonthlyAverage, groupByMonth } from "../helpers/stats";
import { AveragePerMonthType, MonthsEnum } from "../types/StatsTypes";
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
