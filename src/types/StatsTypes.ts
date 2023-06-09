import { CompanyEnum } from "./TradeTypes";

export interface AveragePerMonthType {
    month: MonthsEnum;
    average: number;
}

export interface CompaniesAveragePerMonthType {
    name: CompanyEnum;
    averages: AveragePerMonthType[];
}

export enum MonthsEnum {
    JAN = "janv",
    FEB = "févr",
    MARCH = "mars",
    APRIL = "avril",
    MAI = "mai",
    JUNE = "juin",
    JULY = "juil",
    AUG = "août",
    SEPT = "sept",
    OCT = "oct",
    NOV = "nov",
    DEC = "déc",
}

export interface PriceInfoType {
    price: number;
    timestamp: number;
}

export interface BestTradeInfoType {
    minPriceInfo: PriceInfoType;
    maxPriceInfo: PriceInfoType;
    profit: number;
}
