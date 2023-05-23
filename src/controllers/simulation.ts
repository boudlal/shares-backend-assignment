import { Request, Response } from "express";
import { loadData } from "../services/data";
import { runSimulation } from "../services/simulation";
import { performance } from "perf_hooks";

export const getSimulation = async (req: Request, res: Response) => {
    try {
        const capital = parseFloat(`${req.query.capital}`);

        if (isNaN(capital) || capital <= 0) {
            return res.status(400).json({ message: "Invalid Capital" });
        }

        const PriceData = await loadData();

        const startTime = performance.now();
        const trades = runSimulation(capital, PriceData);
        const endTime = performance.now() - startTime;

        return res.status(200).json({ success: true, trades, performance: endTime });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something Went Wrong, Please Try Again Later" });
    }
};
