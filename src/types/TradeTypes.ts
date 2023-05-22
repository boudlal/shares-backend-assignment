export enum TradeActionEnum {
    BUY = "buy",
    SELL = "sell",
}

export enum CompanyEnum {
    AMAZON = "amazon",
    GOOGLE = "google",
}

export interface TradeType {
    date: Date;
    action: TradeActionEnum;
    name: CompanyEnum;
    unitPrice: number;
    totalShares: number;
    total: number;
    totalWallet: number;
    expectedProfit?: number;
}
