import { AveragePerMonthType, BestTradeInfoType, MonthsEnum } from "../../types/StatsTypes";
import { CompaniesStockPricesType } from "../../types/StockPriceTypes";
import { CompanyEnum } from "../../types/TradeTypes";

export const getAveragePerMonthPriceData = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 10,
            timestamp: 1641272400000,
        },
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 11,
            timestamp: 1643864400000,
        },
        {
            highestPriceOfTheDay: 13,
            lowestPriceOfTheDay: 12,
            timestamp: 1645898400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 8,
            lowestPriceOfTheDay: 7,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 7.2,
            timestamp: 1641272400000,
        },
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 6,
            timestamp: 1643864400000,
        },
        {
            highestPriceOfTheDay: 15,
            lowestPriceOfTheDay: 13,
            timestamp: 1645898400000,
        },
    ],
});
export const getAveragePerMonthExpectedData = (): Record<CompanyEnum, AveragePerMonthType[]> => ({
    [CompanyEnum.AMAZON]: [
        {
            month: MonthsEnum.JAN,
            average: 10.5,
        },
        {
            month: MonthsEnum.FEB,
            average: 12.5,
        },
    ],
    [CompanyEnum.GOOGLE]: [
        {
            month: MonthsEnum.JAN,
            average: 8.05,
        },
        {
            month: MonthsEnum.FEB,
            average: 12,
        },
    ],
});

export const getBestTradeExpectedData = (): Record<CompanyEnum, BestTradeInfoType> => ({
    amazon: {
        profit: 72,
        minPriceInfo: { price: 8, timestamp: 1641186000000 },
        maxPriceInfo: { price: 14, timestamp: 1641272400000 },
    },
    google: {
        profit: 144,
        minPriceInfo: { price: 6, timestamp: 1643864400000 },
        maxPriceInfo: { price: 15, timestamp: 1645898400000 },
    },
});

export const getBestTradeUnprofitableData = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 10,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 6,
            lowestPriceOfTheDay: 6,
            timestamp: 1641272400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 8,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 7,
            lowestPriceOfTheDay: 7,
            timestamp: 1641272400000,
        },
    ],
});
