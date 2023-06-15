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

export interface BestTradeInfoType {
    minPriceInfo: {
        price: number;
        timestamp: number;
    };
    maxPriceInfo: {
        price: number;
        timestamp: number;
    };
    profit: number;
}
