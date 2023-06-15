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
                [MonthsEnum.JAN]: pricesData.slice(0, 2),
                [MonthsEnum.FEB]: pricesData.slice(2),
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

    describe("calculateAndCompareProfit", () => {
        it("should be defined", () => {
            expect(statsHelpers.calculatePriceInfoAndProfit).toBeDefined();
        });

        it("should calculate and return the profit and the new minPriceInfo & maxPriceInfo", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);
            const minPriceInfo = {
                timestamp: prices[0].timestamp,
                price: prices[0].lowestPriceOfTheDay,
            };
            const maxPriceInfo = {
                timestamp: prices[0].timestamp,
                price: prices[0].highestPriceOfTheDay,
            };
            const capital = 100;

            // WHEN
            const result = statsHelpers.calculatePriceInfoAndProfit(capital, prices[1], minPriceInfo, maxPriceInfo);

            // THEN
            const expectedResult = {
                profit: 72,
                maxPriceInfo: { price: 14, timestamp: 1641272400000 },
                minPriceInfo: { timestamp: 1641186000000, price: 8 },
            };
            expect(result).toEqual(expectedResult);
        });

        it("should return new minPriceInfo and maxPriceInfo if the minPriceInfo.price and maxPriceInfo.price are equal to 0", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);
            const minPriceInfo = {
                timestamp: prices[0].timestamp,
                price: 0,
            };
            const maxPriceInfo = {
                timestamp: prices[0].timestamp,
                price: 0,
            };
            const capital = 100;

            // WHEN
            const result = statsHelpers.calculatePriceInfoAndProfit(capital, prices[1], minPriceInfo, maxPriceInfo);

            // THEN
            const expectedMinPriceInfo = { price: 10, timestamp: prices[1].timestamp };
            const expectedMaxPriceInfo = { price: 14, timestamp: prices[1].timestamp };
            expect(result.minPriceInfo).toEqual(expectedMinPriceInfo);
            expect(result.maxPriceInfo).toEqual(expectedMaxPriceInfo);
        });
        it("should return new minPriceInfo and maxPriceInfo if the current day lowest price is less than the minPriceInfo.price and current day Highest price is greater than maxPriceInfo.price ", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);
            const minPriceInfo = {
                timestamp: prices[0].timestamp,
                price: 11,
            };
            const maxPriceInfo = {
                timestamp: prices[0].timestamp,
                price: 12,
            };
            const capital = 100;

            // WHEN
            const result = statsHelpers.calculatePriceInfoAndProfit(capital, prices[1], minPriceInfo, maxPriceInfo);

            // THEN
            const expectedMinPriceInfo = { price: 10, timestamp: prices[1].timestamp };
            const expectedMaxPriceInfo = { price: 14, timestamp: prices[1].timestamp };
            expect(result.minPriceInfo).toEqual(expectedMinPriceInfo);
            expect(result.maxPriceInfo).toEqual(expectedMaxPriceInfo);
        });

        it("should return profit 0 if capital is 0 ", async () => {
            // GIVEN
            const prices = getAveragePerMonthPriceData().amazon.slice(0, 2);
            const minPriceInfo = {
                timestamp: prices[0].timestamp,
                price: prices[0].lowestPriceOfTheDay,
            };
            const maxPriceInfo = {
                timestamp: prices[0].timestamp,
                price: prices[0].highestPriceOfTheDay,
            };
            const capital = 0;

            // WHEN
            const result = statsHelpers.calculatePriceInfoAndProfit(capital, prices[1], minPriceInfo, maxPriceInfo);

            // THEN
            expect(result.profit).toEqual(0);
        });
    });
});
