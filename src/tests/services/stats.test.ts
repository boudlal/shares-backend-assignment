import { CompanyEnum } from "../../types/TradeTypes";
import * as statsService from "../../services/stats";
import * as statsHelpers from "../../helpers/stats";
import {
    getAveragePerMonthExpectedData,
    getAveragePerMonthPriceData,
    getBestTradeExpectedData,
    getBestTradeUnprofitableData,
} from "../dataFactory/statsFactory";
import { CompaniesStockPricesType } from "../../types/StockPriceTypes";
import { AveragePerMonthType, BestTradeInfoType } from "../../types/StatsTypes";

describe("Stats service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getAveragePerMonth", () => {
        it("should be defined", () => {
            expect(statsService.getAveragePerMonth).toBeDefined();
        });

        it("should return an array of AveragePerMonth objects and call groupByMonth && calculateMonthlyAverage", async () => {
            // GIVEN
            const groupByMonthSpy = jest.spyOn(statsHelpers, "groupByMonth");
            const calculateMonthlyAverageSpy = jest.spyOn(statsHelpers, "calculateMonthlyAverage");
            const pricesData = getAveragePerMonthPriceData();

            // WHEN
            const result = await statsService.getAveragePerMonth(pricesData);

            // THEN
            expect(groupByMonthSpy).toBeCalledTimes(2);
            expect(calculateMonthlyAverageSpy).toBeCalledTimes(pricesData.amazon.length);
            expect(result).toEqual(getAveragePerMonthExpectedData());
        });

        it("should call groupByMonth one time and not call calculateMonthlyAverage and return empty Averages array if prices object contains empty arrays", () => {
            // GIVEN
            const groupByMonthSpy = jest.spyOn(statsHelpers, "groupByMonth");
            const calculateMonthlyAverageSpy = jest.spyOn(statsHelpers, "calculateMonthlyAverage");

            const pricesData = { [CompanyEnum.AMAZON]: [], [CompanyEnum.GOOGLE]: [] } as CompaniesStockPricesType;

            // WHEN
            const result = statsService.getAveragePerMonth(pricesData);

            // THEN
            const expectedResult: Record<CompanyEnum, AveragePerMonthType[]> = {
                [CompanyEnum.AMAZON]: [],
                [CompanyEnum.GOOGLE]: [],
            };
            expect(groupByMonthSpy).toBeCalledTimes(2);
            expect(calculateMonthlyAverageSpy).not.toBeCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe("getBestTrade", () => {
        it("should be defined", () => {
            expect(statsService.getBestTrade).toBeDefined();
        });

        it("should return a BestTradeInfoType object for each company and call calculatePriceInfoAndProfit ", async () => {
            // GIVEN
            const spy = jest.spyOn(statsHelpers, "calculatePriceInfoAndProfit");
            const pricesData = getAveragePerMonthPriceData();
            const capital = 100;
            // WHEN
            const result = await statsService.getBestTrade(capital, pricesData);

            // THEN
            const expectedResult = getBestTradeExpectedData();
            expect(spy).toBeCalled();
            expect(result).toEqual(expectedResult);
        });

        it("should return null instead of BestTradeInfoType object for each company and not call calculatePriceInfoAndProfit", async () => {
            // GIVEN
            const spy = jest.spyOn(statsHelpers, "calculatePriceInfoAndProfit");
            const pricesData = getAveragePerMonthPriceData();
            const capital = 0;
            // WHEN
            const result = await statsService.getBestTrade(capital, pricesData);

            // THEN
            const expectedResult: Record<CompanyEnum, BestTradeInfoType> = {
                [CompanyEnum.AMAZON]: null,
                [CompanyEnum.GOOGLE]: null,
            };
            expect(spy).not.toBeCalled();
            expect(result).toEqual(expectedResult);
        });

        it("should return null instead of BestTradeInfoType object for each company and call calculatePriceInfoAndProfit if no profit can be made", () => {
            // GIVEN
            const spy = jest.spyOn(statsHelpers, "calculatePriceInfoAndProfit");
            const pricesData = getBestTradeUnprofitableData();
            const capital = 100;

            // WHEN
            const result = statsService.getBestTrade(capital, pricesData);

            // THEN
            const expectedResult: Record<CompanyEnum, BestTradeInfoType> = {
                [CompanyEnum.AMAZON]: null,
                [CompanyEnum.GOOGLE]: null,
            };
            expect(spy).toBeCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});
