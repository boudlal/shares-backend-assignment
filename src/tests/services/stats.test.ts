import { CompanyEnum } from "../../types/TradeTypes";
import * as statsService from "../../services/stats";
import * as statsHelpers from "../../helpers/stats";
import { getAveragePerMonthExpectedData, getAveragePerMonthPriceData } from "../dataFactory/statsFactory";
import { CompaniesStockPricesType } from "../../types/StockPriceTypes";
import { AveragePerMonthType } from "../../types/StatsTypes";

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
});
