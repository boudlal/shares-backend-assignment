import * as dataService from "../../services/data";
import * as statsService from "../../services/stats";
import { getStats } from "../../controllers/stats";
import { createRequest, createResponse } from "node-mocks-http";
import { CompanyEnum } from "../../types/TradeTypes";

describe("StatsController", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("getStats", () => {
        it("should call loadStocksPrices & getAveragePerMonth & getBestTrade then return statusCode 200, and averages & bestTrade ", async () => {
            // GIVEN
            const loadStocksPricesSpy = jest.spyOn(dataService, "loadStocksPrices");
            const getAveragePerMonthSpy = jest.spyOn(statsService, "getAveragePerMonth");
            const getBestTradeSpy = jest.spyOn(statsService, "getBestTrade");
            const request = createRequest();
            const response = createResponse();

            // WHEN
            await getStats(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();
            expect(loadStocksPricesSpy).toBeCalledTimes(1);
            expect(getAveragePerMonthSpy).toBeCalledTimes(1);
            expect(getBestTradeSpy).toBeCalledTimes(1);
            expect(statusCode).toEqual(200);

            expect(Array.isArray(body.averages[CompanyEnum.AMAZON])).toEqual(true);
            expect(Array.isArray(body?.averages[CompanyEnum.GOOGLE])).toEqual(true);
            expect(Object.keys(body.bestTrade)).toEqual(Object.values(CompanyEnum));
        });

        it("should call loadStocksPrices and return status 500 and an error message if and error occured in loadStocksPrices", async () => {
            // GIVEN
            const loadStocksPricesSpy = jest.spyOn(dataService, "loadStocksPrices").mockImplementation(() => {
                throw "error";
            });
            const getAveragePerMonthSpy = jest.spyOn(statsService, "getAveragePerMonth");
            const getBestTradeSpy = jest.spyOn(statsService, "getBestTrade");
            const request = createRequest();
            const response = createResponse();

            // WHEN
            await getStats(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadStocksPricesSpy).toBeCalledTimes(1);
            expect(getAveragePerMonthSpy).not.toBeCalled();
            expect(getBestTradeSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(500);
        });

        it("should call loadStocksPrices & getAveragePerMonth and return status 500 and an error message if and error occured in getAveragePerMonth", async () => {
            // GIVEN
            const loadStocksPricesSpy = jest.spyOn(dataService, "loadStocksPrices");
            const getAveragePerMonthSpy = jest.spyOn(statsService, "getAveragePerMonth").mockImplementation(() => {
                throw "error";
            });
            const getBestTradeSpy = jest.spyOn(statsService, "getBestTrade");
            const request = createRequest();
            const response = createResponse();

            // WHEN
            await getStats(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadStocksPricesSpy).toBeCalledTimes(1);
            expect(getAveragePerMonthSpy).toBeCalledTimes(1);
            expect(getBestTradeSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(500);
        });

        it("should call loadStocksPrices & getAveragePerMonth & getBestTrade and return status 500 and an error message if and error occured in getAveragePerMonth", async () => {
            // GIVEN
            const loadStocksPricesSpy = jest.spyOn(dataService, "loadStocksPrices");
            const getAveragePerMonthSpy = jest.spyOn(statsService, "getAveragePerMonth");
            const getBestTradeSpy = jest.spyOn(statsService, "getBestTrade").mockImplementation(() => {
                throw "error";
            });

            const request = createRequest();
            const response = createResponse();

            // WHEN
            await getStats(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadStocksPricesSpy).toBeCalledTimes(1);
            expect(getAveragePerMonthSpy).toBeCalledTimes(1);
            expect(getBestTradeSpy).toBeCalledTimes(1);
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(500);
        });
    });
});
