import { CompanyEnum, TradeActionEnum, TradeType } from "../types/TradeTypes";
import { CompaniesStockPricesType } from "../types/StockPriceTypes";

export const getBuyTrade = (trade: Partial<TradeType> = {}): TradeType => ({
    date: new Date(1641186000000),
    action: TradeActionEnum.BUY,
    name: CompanyEnum.AMAZON,
    unitPrice: 8,
    totalShares: 12,
    total: 96,
    totalWallet: 4,
    expectedProfit: 72,
    ...trade,
});
export const getSellTrade = (trade: Partial<TradeType> = {}): TradeType => ({
    date: new Date(1641272400000),
    action: TradeActionEnum.SELL,
    name: CompanyEnum.AMAZON,
    unitPrice: 14,
    totalShares: 12,
    total: 168,
    totalWallet: 172,
    expectedProfit: null,
    ...trade,
});

export const getFullSimulationPriceData = (): CompaniesStockPricesType => ({
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
            timestamp: 1641358800000,
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
            timestamp: 1641358800000,
        },
    ],
});

export const getFullSimulationExpectedData = (): TradeType[] => [
    {
        date: new Date(1641186000000),
        action: TradeActionEnum.BUY,
        name: CompanyEnum.AMAZON,
        unitPrice: 8,
        totalShares: 12,
        total: 96,
        totalWallet: 4,
        expectedProfit: 72,
    },
    {
        date: new Date(1641272400000),
        action: TradeActionEnum.SELL,
        name: CompanyEnum.AMAZON,
        unitPrice: 14,
        totalShares: 12,
        total: 168,
        totalWallet: 172,
        expectedProfit: null,
    },
    {
        date: new Date(1641272400000),
        action: TradeActionEnum.BUY,
        name: CompanyEnum.GOOGLE,
        unitPrice: 7.2,
        totalShares: 23,
        total: 165.6,
        totalWallet: 6.4,
        expectedProfit: 156.4,
    },
    {
        date: new Date(1641358800000),
        action: TradeActionEnum.SELL,
        name: CompanyEnum.GOOGLE,
        unitPrice: 14,
        totalShares: 23,
        total: 322,
        totalWallet: 328.4,
        expectedProfit: null,
    },
];

export const getProfitableHoldPrices = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 10,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 16,
            lowestPriceOfTheDay: 10,
            timestamp: 1641272400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 9,
            lowestPriceOfTheDay: 7,
            timestamp: 1641272400000,
        },
    ],
});

export const getUnprofitableHoldPrices = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 10,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 8,
            lowestPriceOfTheDay: 7,
            timestamp: 1641272400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 9,
            lowestPriceOfTheDay: 7,
            timestamp: 1641272400000,
        },
    ],
});

export const getIdenticalPricesOverDays = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 14,
            lowestPriceOfTheDay: 8,
            timestamp: 1641272400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 9,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 9,
            timestamp: 1641272400000,
        },
    ],
});

export const getUnprofitablePrices = (): CompaniesStockPricesType => ({
    amazon: [
        {
            highestPriceOfTheDay: 10,
            lowestPriceOfTheDay: 8,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 7,
            lowestPriceOfTheDay: 6,
            timestamp: 1641272400000,
        },
    ],
    google: [
        {
            highestPriceOfTheDay: 8,
            lowestPriceOfTheDay: 7,
            timestamp: 1641186000000,
        },
        {
            highestPriceOfTheDay: 7,
            lowestPriceOfTheDay: 6,
            timestamp: 1641272400000,
        },
    ],
});
