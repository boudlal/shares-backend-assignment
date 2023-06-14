import { CompanyEnum, TradeActionEnum, TradeType } from "../../types/TradeTypes";
import * as simulationService from "../../services/simulation";
import * as simulationHelpers from "../../helpers/simulation";
import { StockPriceType, CompaniesStockPricesType } from "../../types/StockPriceTypes";
import {
    getFullSimulationPriceData,
    getBuyTrade,
    getCurrentPrice,
    getSellTrade,
    getProfitableHoldPrices,
    getUnprofitableHoldPrices,
    getIdenticalPricesOverDays,
    getUnprofitablePrices,
    getFullSimulationExpectedData,
} from "../dataFactory/simulationFactory";

describe("Simulation service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("runSimulation", () => {
        it("should be defined", () => {
            expect(simulationService.runSimulation).toBeDefined();
        });

        it("should call getNextTrades & getFinalTrade and return an array of trades needed to make the max profit of trading stocks", () => {
            // GIVEN
            const getNextTradesSpy = jest.spyOn(simulationService, "getNextTrades");
            const getFinalTradeSpy = jest.spyOn(simulationService, "getFinalTrade");
            const capital = 100;

            // WHEN
            const result = simulationService.runSimulation(capital, getFullSimulationPriceData()) as TradeType[];

            // THEN
            const expectedResult = getFullSimulationExpectedData();
            expect(getNextTradesSpy).toHaveBeenCalled();
            expect(getFinalTradeSpy).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it("should return an empty array if capital is 0", () => {
            // GIVEN
            const getNextTradesSpy = jest.spyOn(simulationService, "getNextTrades");
            const getFinalTradeSpy = jest.spyOn(simulationService, "getFinalTrade");
            const capital = 0;

            // WHEN
            const result = simulationService.runSimulation(capital, getFullSimulationPriceData()) as TradeType[];

            // THEN
            expect(getNextTradesSpy).not.toHaveBeenCalled();
            expect(getFinalTradeSpy).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it("should return an empty array if prices object contains empty arrays", () => {
            // GIVEN
            const getNextTradesSpy = jest.spyOn(simulationService, "getNextTrades");
            const getFinalTradeSpy = jest.spyOn(simulationService, "getFinalTrade");
            const capital = 100;
            const prices = { [CompanyEnum.AMAZON]: [], [CompanyEnum.GOOGLE]: [] } as CompaniesStockPricesType;

            // WHEN
            const result = simulationService.runSimulation(capital, prices) as TradeType[];

            // THEN
            expect(getNextTradesSpy).not.toHaveBeenCalled();
            expect(getFinalTradeSpy).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe("getFinalTrade", () => {
        it("should return a sell trade and call formatSellTrade if the previous trade's action is BUY", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const previousTrade = getBuyTrade();
            const currentPrice: StockPriceType = getCurrentPrice();

            // WHEN
            const result = simulationService.getFinalTrade(previousTrade, currentPrice);

            // THEN
            expect(result.action).toEqual(TradeActionEnum.SELL);
            expect(spy).toBeCalled();
        });
        it("should return null and not call formatSellTrade if the previous trade's action is SELL", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const previousTrade = getSellTrade();
            const currentPrice: StockPriceType = getCurrentPrice();

            // WHEN
            const result = simulationService.getFinalTrade(previousTrade, currentPrice);
            console.log("--result", result);

            // THEN
            expect(result).toEqual(null);
            expect(spy).not.toBeCalled();
        });
        it("should return null and not call formatSellTrade if the previous trade is null", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const previousTrade: TradeType = null;
            const currentPrice: StockPriceType = getCurrentPrice();

            // WHEN
            const result = simulationService.getFinalTrade(previousTrade, currentPrice);

            // THEN
            expect(result).toEqual(null);
            expect(spy).not.toBeCalled();
        });
    });

    describe("getNextTrades", () => {
        it("should be defined", () => {
            expect(simulationService.getNextTrades).toBeDefined();
        });

        it("should return an array of next trades and an expected profit and call getBestTradeInMarket when currentTrade is null (day === 0) ", () => {
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");

            const currentTrade: TradeType = null;
            const currentDayIndex = 0;
            const capital = 100;

            const result = simulationService.getNextTrades(
                currentTrade,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            expect(Array.isArray(result.trades)).toEqual(true);
            expect(typeof result.expectedProfit).toEqual("number");
            expect(spy).toBeCalled();
        });

        it("should return an array of next trades and an expected profit and call getBestTradeInMarket to execute when currentTrade exists ", () => {
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");

            const currentTrade = getBuyTrade();
            const currentDayIndex = 1;
            const capital = 100;

            const result = simulationService.getNextTrades(
                currentTrade,
                capital,
                getFullSimulationPriceData(),
                currentDayIndex,
            );

            expect(Array.isArray(result.trades)).toEqual(true);
            expect(typeof result.expectedProfit).toEqual("number");
            expect(spy).toBeCalled();
        });

        it("should return an empty array of trades if no profit can be made ", () => {
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");

            const currentTrade: TradeType = null;
            const currentDayIndex = 0;
            const capital = 100;
            const prices = {
                amazon: [
                    {
                        highestPriceOfTheDay: 9,
                        lowestPriceOfTheDay: 8,
                        timestamp: 1641186000000,
                    },
                    {
                        highestPriceOfTheDay: 7,
                        lowestPriceOfTheDay: 6,
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
                        highestPriceOfTheDay: 8,
                        lowestPriceOfTheDay: 7,
                        timestamp: 1641272400000,
                    },
                ],
            };

            const result = simulationService.getNextTrades(currentTrade, capital, prices, currentDayIndex);

            expect(result.trades.length).toEqual(0);
            expect(spy).toBeCalled();
        });
        // should return an empty array and the new expected profit if holding the current stock is more profitable than selling it and buying another one
        it("should return an empty array and the new expected profit if holding the current stock is more profitable than selling it and buying another one", () => {
            const spy = jest.spyOn(simulationService, "getHoldOrSellTrade");

            const currentTrade = getBuyTrade();

            //21

            const currentDayIndex = 0;
            const prices = getProfitableHoldPrices();

            const result = simulationService.getNextTrades(
                currentTrade,
                currentTrade.totalWallet,
                prices,
                currentDayIndex,
            );

            expect(result.trades.length).toEqual(0);
            expect(result.expectedProfit).toEqual(96);
            expect(spy).toBeCalled();
        });

        // should return an array with a sell trade if selling the current stock is more profitable than holding it
        it("should return an array containing a sell trade if selling the current stock is more profitable than holding it", () => {
            const spy = jest.spyOn(simulationService, "getHoldOrSellTrade");

            const currentTrade = getBuyTrade();

            //21

            const currentDayIndex = 0;
            const prices = getUnprofitableHoldPrices();

            const result = simulationService.getNextTrades(
                currentTrade,
                currentTrade.totalWallet,
                prices,
                currentDayIndex,
            );

            expect(result.trades[0].action).toEqual(TradeActionEnum.SELL);
            expect(result.trades[0].name).toEqual(currentTrade.name);
            expect(spy).toBeCalled();
        });

        it("should call getBestTradeInMarket with specific arguments if selling the current stock is more profitable than holding it", () => {
            // GIVEN
            const spy = jest.spyOn(simulationService, "getBestTradeInMarket");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getUnprofitableHoldPrices();

            // WHEN
            simulationService.getNextTrades(currentTrade, currentTrade.totalWallet, prices, currentDayIndex);

            // THEN
            const expectedCompanies = [CompanyEnum.GOOGLE]; // without including the previous bought company
            const expectedCapital = currentTrade.total + currentTrade.expectedProfit + currentTrade.totalWallet;
            expect(spy).toHaveBeenCalledWith(expectedCompanies, expectedCapital, prices, currentDayIndex);
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
            expect(result.trades[0].totalWallet).toEqual(172);
            expect(result.trades[1].action).toEqual(TradeActionEnum.BUY);
            expect(result.trades[1].name).toEqual(CompanyEnum.GOOGLE);
            expect(result.trades[1].totalWallet).toEqual(4);
            expect(result.expectedProfit).toEqual(126);
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
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getProfitableHoldPrices();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade).toEqual(null);
            expect(result.expectedProfit).toEqual(96);
            expect(spy).not.toBeCalled();
        });

        it("should return an empty array and the new expected profit if holding the current stock is equal to selling it", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getIdenticalPricesOverDays();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade).toEqual(null);
            expect(result.expectedProfit).toEqual(currentTrade.expectedProfit);
            expect(spy).not.toBeCalled();
        });

        it("should return a sell trade and null expected profit if holding the current stock is less profitable than selling it", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "formatSellTrade");
            const currentTrade = getBuyTrade();
            const currentDayIndex = 0;
            const prices = getUnprofitableHoldPrices();

            // WHEN
            const result = simulationService.getHoldOrSellTrade(currentTrade, prices, currentDayIndex);

            // THEN
            expect(result.trade.action).toEqual(TradeActionEnum.SELL);
            expect(result.expectedProfit).toEqual(null);
            expect(spy).toBeCalled();
        });
    });

    describe("getBestTradeInMarket", () => {
        it("should be defined", () => {
            expect(simulationService.getNextTrades).toBeDefined();
        });

        it("should return a correct tradeType object and call calculateNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "calculateNextDayProfit");
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

        it("should return null and call calculateNextDayProfit if there is no profitable trade", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "calculateNextDayProfit");
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

        it("should return null if capital is 0 and not call calculateNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "calculateNextDayProfit");
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

        it("should return null if the current day is the last day and not call calculateNextDayProfit", () => {
            // GIVEN
            const spy = jest.spyOn(simulationHelpers, "calculateNextDayProfit");
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
});
