import { TradeType } from "../../types/TradeTypes";
import * as simulationHelpers from "../../helpers/simulation";
import { StockPriceType } from "../../types/StockPriceTypes";
import { getBuyTrade, getCurrentPrice, getSellTrade } from "../dataFactory";

describe("Simulation helpers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("calculateNextDayProfit", () => {
        it("should be defined", () => {
            expect(simulationHelpers.calculateNextDayProfit).toBeDefined();
        });

        it("should return a TradeType object containing the expectedProfit, totalShares, totalWallet, total and unitPrice", () => {
            // Given
            const capital = 100;

            // WHEN
            const result = simulationHelpers.calculateNextDayProfit(capital, 10, 12);

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
            const result = simulationHelpers.calculateNextDayProfit(capital, 9, 12);

            // THEN
            expect(result.totalWallet).toBeGreaterThan(0);
        });

        it("should return negative profit if next day price is less than the current day", () => {
            // GIVEN
            const capital = 100;

            // WHEN
            const result = simulationHelpers.calculateNextDayProfit(capital, 10, 8);

            // THEN
            expect(result.expectedProfit).toBeLessThan(0);
        });
    });

    describe("formatSellTrade", () => {
        it("should be defined", () => {
            expect(simulationHelpers.formatSellTrade).toBeDefined();
        });

        it("should return a TradeType object with correct data", () => {
            // GIVEN
            const currentTrade = getBuyTrade();
            const currentPrice = getCurrentPrice();

            // WHEN
            const result = simulationHelpers.formatSellTrade(currentTrade, currentPrice);

            // THEN
            const expectedResult: TradeType = {
                ...getSellTrade(),
                name: currentTrade.name,
                date: new Date(currentPrice.timestamp),
            };
            expect(result).toEqual(expectedResult);
        });
        it("should return null if currentPrice is null", () => {
            // GIVEN
            const currentTrade = getBuyTrade();
            const currentPrice: StockPriceType = null;

            // WHEN
            const result = simulationHelpers.formatSellTrade(currentTrade, currentPrice);

            // THEN
            expect(result).toEqual(null);
        });
        it("should return null if currentTrade is null", () => {
            // GIVEN
            const currentTrade: TradeType = null;
            const currentPrice = getCurrentPrice();

            // WHEN
            const result = simulationHelpers.formatSellTrade(currentTrade, currentPrice);

            // THEN
            expect(result).toEqual(null);
        });
    });
});
