import { CompanyEnum } from "../../types/TradeTypes";
import * as statsService from "../../service/stats";
import * as statsHelpers from "../../helpers/stats";
import { getAveragePerMonthExpectedData, getAveragePerMonthPriceData } from "../dataFactory/statsFactory";
import { CompaniesStockPricesType } from "../../types/StockPriceTypes";
import { CompaniesAveragePerMonthType } from "../../types/StatsTypes";

describe("Stats service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getAveragePerMonth", () => {
        it("should be defined", () => {
            expect(statsService.getAveragePerMonth).toBeDefined();
        });

        it("should return an array of AveragePerMonth objects and call groupByMonth && calculateAverage", async () => {
            // GIVEN
            const groupByMonthSpy = jest.spyOn(statsHelpers, "groupByMonth");
            const calculateAverageSpy = jest.spyOn(statsHelpers, "calculateAverage");
            const pricesData = getAveragePerMonthPriceData();

            // WHEN
            const result = await statsService.getAveragePerMonth(pricesData);

            // THEN
            expect(groupByMonthSpy).toBeCalledTimes(2);
            expect(calculateAverageSpy).toBeCalledTimes(2 * pricesData.amazon.length);
            expect(result).toEqual(getAveragePerMonthExpectedData());
        });

        it("should call groupByMonth one time and not call calculateAverage and return empty Averages array if prices object contains empty arrays", () => {
            // GIVEN
            const groupByMonthSpy = jest.spyOn(statsHelpers, "groupByMonth");
            const calculateAverageSpy = jest.spyOn(statsHelpers, "calculateAverage");

            const pricesData = { [CompanyEnum.AMAZON]: [], [CompanyEnum.GOOGLE]: [] } as CompaniesStockPricesType;

            // WHEN
            const result = statsService.getAveragePerMonth(pricesData);

            // THEN
            const expectedResult: CompaniesAveragePerMonthType[] = [
                {
                    name: CompanyEnum.AMAZON,
                    averages: [],
                },
                {
                    name: CompanyEnum.GOOGLE,
                    averages: [],
                },
            ];
            expect(groupByMonthSpy).toBeCalledTimes(2);
            expect(calculateAverageSpy).not.toBeCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});
