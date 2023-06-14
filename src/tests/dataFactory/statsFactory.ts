import { CompaniesAveragePerMonthType, MonthsEnum } from "../../types/StatsTypes";
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
            lowestPriceOfTheDay: 10,
            timestamp: 1643864400000,
        },
        {
            highestPriceOfTheDay: 15,
            lowestPriceOfTheDay: 13,
            timestamp: 1645898400000,
        },
    ],
});
export const getAveragePerMonthExpectedData = (): CompaniesAveragePerMonthType[] => [
    {
        name: CompanyEnum.AMAZON,
        averages: [
            {
                month: MonthsEnum.JAN,
                average: 10.5,
            },
            {
                month: MonthsEnum.FEB,
                average: 12.5,
            },
        ],
    },
    {
        name: CompanyEnum.GOOGLE,
        averages: [
            {
                month: MonthsEnum.JAN,
                average: 8.05,
            },
            {
                month: MonthsEnum.FEB,
                average: 13,
            },
        ],
    },
];
