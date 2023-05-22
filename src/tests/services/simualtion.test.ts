import { CompanyEnum, TradeActionEnum, TradeType } from "../../types/TradeTypes";
import * as simulationService from "../../services/simulation";
import {
    getFullSimulationPriceData,
    getBuyTrade,
    getSellTrade,
    getProfitableHoldPrices,
    getUnprofitableHoldPrices,
    getIdenticalPricesOverDays,
    getUnprofitablePrices,
    getFullSimulationExpectedData,
} from "../dataFactory";

describe("Simulation service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("runSimulation", () => {
        it("should be defined", () => {
            expect(simulationService.runSimulation).toBeDefined();
        });

        it("should return an array of transactions needed to make the max profit of trading stocks", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextTrades");
            const capital = 100;

            // WHEN
            const result = simulationService.runSimulation(capital, getFullSimulationPriceData()) as TradeType[];

            // THEN
            const expectedResult = getFullSimulationExpectedData();
            expect(spy).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it("should return an empty array if capital is 0", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextTrades");
            const capital = 0;

            // WHEN
            const result = simulationService.runSimulation(capital, getFullSimulationPriceData()) as TradeType[];

            // THEN
            expect(spy).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe("getNextTrades", () => {
        it("should be defined", () => {
            expect(simulationService.getNextTrades).toBeDefined();
        });

        it("should return an array of next trades and an expected profit and call getBestTradeInMarket when currentTrade is null (day === 0) ", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const currentTrade: TradeType = null;
            const currentDayIndex = 0;
            const capital = 100;

            // WHEN
            const result = simulationService.getNextTrades(
                currentTrade,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            // THEN
            expect(Array.isArray(result.trades)).toEqual(true);
            expect(typeof result.expectedProfit).toEqual("number");
            expect(spy).toBeCalled();
        });

        it("should return an array of next trades and an expected profit and call getBestTradeInMarket to execute when currentTrade exists ", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 1;
            const capital = 100;

            // WHEN
            const result = simulationService.getNextTrades(
                currentTrade,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            // THEN
            expect(Array.isArray(result.trades)).toEqual(true);
            expect(typeof result.expectedProfit).toEqual("number");
            expect(spy).toBeCalled();
        });

        it("should return an empty array of trades if no profit can be made ", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const currentTrade: TradeType = null;
            const currentDayIndex = 0;
            const capital = 100;
            const prices = getUnprofitablePrices();

            // WHEN
            const result = simulationService.getNextTrades(currentTrade, capital, prices, currentDayIndex);

            // THEN
            expect(result.trades.length).toEqual(0);
            expect(spy).toBeCalled();
        });

        it("should return an empty array and the new expected profit if holding the current stock is more profitable than selling it and buying another one", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getHoldOrSellTrade");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getProfitableHoldPrices();

            // WHEN
            const result = simulationService.getNextTrades(
                currentTrade,
                currentTrade.totalWallet,
                prices,
                currentDayIndex,
            );

            // THEN
            expect(result.trades.length).toEqual(0);
            expect(result.expectedProfit).toEqual(96);
            expect(spy).toBeCalled();
        });

        it("should return an array containing a sell trade if selling the current stock is more profitable than holding it", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getHoldOrSellTrade");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getUnprofitableHoldPrices();

            // WHEN
            const result = simulationService.getNextTrades(
                currentTrade,
                currentTrade.totalWallet,
                prices,
                currentDayIndex,
            );

            // THEN
            expect(result.trades[0].action).toEqual(TradeActionEnum.SELL);
            expect(result.trades[0].name).toEqual(currentTrade.name);
            expect(spy).toBeCalled();
        });

        it("should return an array of 2 trades if selling the current stock and buying the other one is more profitable ", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = {
                amazon: [
                    {
                        highestPriceOfTheDay: 14,
                        lowestPriceOfTheDay: 10,
                        timestamp: 1641186000000,
                    },
                    {
                        highestPriceOfTheDay: 16,
                        lowestPriceOfTheDay: 10,
                        timestamp: 1641272400000,
                    },
                ],
                google: [
                    {
                        highestPriceOfTheDay: 10,
                        lowestPriceOfTheDay: 8,
                        timestamp: 1641186000000,
                    },
                    {
                        highestPriceOfTheDay: 14,
                        lowestPriceOfTheDay: 7,
                        timestamp: 1641272400000,
                    },
                ],
            };

            // WHEN
            const result = simulationService.getNextTrades(
                currentTrade,
                currentTrade.totalWallet,
                prices,
                currentDayIndex,
            );

            // THEN
            expect(result.trades.length).toEqual(2);
            expect(result.trades[0].action).toEqual(TradeActionEnum.SELL);
            expect(result.trades[0].name).toEqual(currentTrade.name);
            expect(result.trades[1].action).toEqual(TradeActionEnum.BUY);
            expect(result.trades[1].name).toEqual(CompanyEnum.GOOGLE);
            expect(result.expectedProfit).toEqual(122);
            expect(spy).toBeCalled();
        });
    });

    describe("getBuyTrade", () => {
        it("should call getBestTradeInMarket with the initial capital and return a buy trade and the previous trade does not exist", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");

            const previousTrade: TradeType = null;
            const initialCapital = 100;
            const prices = getFullSimulationPriceData();
            const currentDay = 0;

            // WHEN
            const result = simulationService.getBuyTrade(previousTrade, initialCapital, prices, currentDay);

            // THEN
            expect(result.action).toEqual(TradeActionEnum.BUY);
            expect(spy.mock.lastCall[1]).toEqual(initialCapital);
        });
        it("should get the current capital from the previous trade, call getBestTradeInMarket with it and return a buy trade if previous trade exists with action SELL", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const previousTrade = getSellTrade();
            const initialCapital = 100;
            const prices = getFullSimulationPriceData();
            const currentDay = 0;

            // WHEN
            const result = simulationService.getBuyTrade(previousTrade, initialCapital, prices, currentDay);

            // THEN
            expect(result.action).toEqual(TradeActionEnum.BUY);
            expect(spy.mock.lastCall[1]).toEqual(previousTrade.totalWallet);
        });
        it("should call getBestTradeInMarket and return null if capital is 0", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const previousTrade: TradeType = null;
            const initialCapital = 0;
            const prices = getFullSimulationPriceData();
            const currentDay = 0;

            // WHEN

            const result = simulationService.getBuyTrade(previousTrade, initialCapital, prices, currentDay);

            // THEN
            expect(result).toEqual(null);
            expect(spy.mock.lastCall[1]).toEqual(initialCapital);
        });
    });

    describe("getHoldOrSellTrade", () => {
        it("should return an empty array and the new expected profit if holding the current stock is more profitable than selling it", () => {
            // GIVEN
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getProfitableHoldPrices();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade).toEqual(null);
            expect(result.expectedProfit).toEqual(96);
        });

        it("should return an empty array and the new expected profit if holding the current stock is equal to selling it", () => {
            // GIVEN
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getIdenticalPricesOverDays();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade).toEqual(null);
            expect(result.expectedProfit).toEqual(currentTrade.expectedProfit);
        });

        it("should return a sell trade and null expected profit if holding the current stock is less profitable than selling it", () => {
            // GIVEN
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getUnprofitableHoldPrices();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade.action).toEqual(TradeActionEnum.SELL);
            expect(result.expectedProfit).toEqual(null);
        });
    });

    describe("getBestTradeInMarket", () => {
        it("should be defined", () => {
            expect(simulationService.getNextTrades).toBeDefined();
        });

        it("should return a correct tradeType object and call getNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextDayProfit");
            const companies = Object.values(CompanyEnum);
            const currentDayIndex = 0;
            const capital = 100;

            // WHEN
            const result = simulationService.getBestTradeInMarket(
                companies,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            // THEN
            const expectedResult = getBuyTrade();
            expect(result).toEqual(expectedResult);
            expect(spy).toBeCalled();
        });

        it("should return null and call getNextDayProfit if there is no profitable trade", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextDayProfit");
            const companies = Object.values(CompanyEnum);
            const currentDayIndex = 0;
            const capital = 100;
            const prices = getUnprofitablePrices();

            // WHEN
            const result = simulationService.getBestTradeInMarket(companies, capital, prices, currentDayIndex);

            // THEN
            expect(result).toEqual(null);
            expect(spy).toBeCalled();
        });

        it("should return null if capital is 0 and not call getNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextDayProfit");
            const companies = Object.values(CompanyEnum);
            const currentDayIndex = 0;
            const capital = 0;

            // WHEN
            const result = simulationService.getBestTradeInMarket(
                companies,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            // THEN
            expect(result).toBe(null);
            expect(spy).not.toBeCalled();
        });

        it("should return null if the current day is the last day and not call getNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getNextDayProfit");
            const companies = Object.values(CompanyEnum);
            const currentDayIndex = getFullSimulationPriceData().amazon.length - 1;
            const capital = 0;

            // WHEN
            const result = simulationService.getBestTradeInMarket(
                companies,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            // THEN
            expect(result).toBe(null);
            expect(spy).not.toBeCalled();
        });
    });

    describe("getNextDayProfit", () => {
        it("should be defined", () => {
            expect(simulationService.getNextDayProfit).toBeDefined();
        });

        it("should return a TradeType object containing the expectedProfit, totalShares, totalWallet, total and unitPrice", () => {
            // Given
            const capital = 100;

            // WHEN
            const result = simulationService.getNextDayProfit(capital, 10, 12);

            // THEN
            const expectedResult = {
                expectedProfit: 20,
                totalShares: 10,
                total: 100,
                totalWallet: 0,
                unitPrice: 10,
            };
            expect(result).toEqual(expectedResult);
        });

        it("should return totalWallet greater than 0, if we still have funds after buying shares", () => {
            // GIVEN
            const capital = 100;

            // WHEN
            const result = simulationService.getNextDayProfit(capital, 9, 12);

            // THEN
            expect(result.totalWallet).toBeGreaterThan(0);
        });

        it("should return negative profit if next day price is less than the current day", () => {
            // GIVEN
            const capital = 100;

            // WHEN
            const result = simulationService.getNextDayProfit(capital, 10, 8);

            // THEN
            expect(result.expectedProfit).toBeLessThan(0);
        });
    });
});
