import { Request, Response } from "express";
import { loadStocksPrices } from "../services/data";
import { getAveragePerMonth, getBestTrade } from "../services/stats";

export const getStats = async (req: Request, res: Response) => {
    try {
        const capital = 100000;

        const stocksPrices = await loadStocksPrices();

        const averages = getAveragePerMonth(stocksPrices);
        const bestTrade = getBestTrade(capital, stocksPrices);

        return res.status(200).json({ success: true, averages, bestTrade });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something Went Wrong, Please Try Again Later" });
    }
};
