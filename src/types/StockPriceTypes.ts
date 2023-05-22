import { CompanyEnum } from "./TradeTypes";

export interface StockPriceType {
    highestPriceOfTheDay: number;
    lowestPriceOfTheDay: number;
    timestamp: number;
}

export type CompaniesStockPricesType = Record<CompanyEnum, StockPriceType[]>;
