import * as statsHelpers from "../../helpers/stats";
import { StockPriceType } from "../../types/StockPriceTypes";
import { getAveragePerMonthPriceData } from "../dataFactory/statsFactory";
import { MonthsEnum } from "../../types/StatsTypes";

describe("Stats helpers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("groupByMonth", () => {
        it("should be defined", () => {
            expect(statsHelpers.groupByMonth).toBeDefined();
        });

        it("should return prices grouped by month and call getMonthFromTimestamp", async () => {
            // GIVEN
            const spy = jest.spyOn(statsHelpers, "getMonthFromTimestamp");
            const pricesData = getAveragePerMonthPriceData().amazon;
            // WHEN
            const result = statsHelpers.groupByMonth(pricesData);

            // THEN
            const expectedResult = {
                [MonthsEnum.JAN]: pricesData.slice(0, 1),
                [MonthsEnum.FEB]: pricesData.slice(2, 3),
            };
            expect(spy).toBeCalledTimes(pricesData.length);
            expect(result).toEqual(expectedResult);
        });

        it("should return empty object if no the prices array is empty and not call getMonthFromTimestamp", async () => {
            // GIVEN
            const spy = jest.spyOn(statsHelpers, "getMonthFromTimestamp");
            const pricesData: StockPriceType[] = [];

            // WHEN
            const result = statsHelpers.groupByMonth(pricesData);

            // THEN
            expect(spy).not.toBeCalled();
            expect(result).toEqual({});
        });
    });

    describe("getMonthFromTimestamp", () => {
        it("should be defined", () => {
            expect(statsHelpers.getMonthFromTimestamp).toBeDefined();
        });

        it("should return the month from the timestamp", async () => {
            // GIVEN
            const janTimestamp = getAveragePerMonthPriceData().amazon[0].timestamp;
            const febTimestamp = getAveragePerMonthPriceData().amazon[3].timestamp;

            // WHEN
            const janResult = statsHelpers.getMonthFromTimestamp(janTimestamp);
            const febResult = statsHelpers.getMonthFromTimestamp(febTimestamp);

            // THEN
            expect(janResult).toEqual(MonthsEnum.JAN);
            expect(febResult).toEqual(MonthsEnum.FEB);
        });
        it("should return undefined if the timestamp is not valid", async () => {
            // GIVEN
            // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
            const janTimestamp = 99999999999e9999;
            const febTimestamp = NaN;

            // WHEN
            const janResult = statsHelpers.getMonthFromTimestamp(janTimestamp);
            const febResult = statsHelpers.getMonthFromTimestamp(febTimestamp);

            // THEN
            expect(janResult).toEqual(undefined);
            expect(febResult).toEqual(undefined);
        });
    });

    describe("calculateMonthlyAverage", () => {
        it("should be defined", () => {
            expect(statsHelpers.calculateMonthlyAverage).toBeDefined();
        });

        it("should return the month's average price", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);

            // WHEN
            const result = statsHelpers.calculateMonthlyAverage(prices);

            // THEN
            expect(result).toEqual(10.5);
        });

        it("should return NaN an value inside the array prices is NaN", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);
            prices[0].highestPriceOfTheDay = NaN;
            // WHEN
            const result = statsHelpers.calculateMonthlyAverage(prices);

            // THEN
            expect(result).toEqual(NaN);
        });

        it("should return 0 if the array is empty", async () => {
            // WHEN
            const result = statsHelpers.calculateMonthlyAverage([]);

            // THEN
            expect(result).toEqual(0);
        });
    });
});
