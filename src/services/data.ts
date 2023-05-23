import fs from "fs/promises";
import { CompaniesStockPricesType } from "../types/StockPriceTypes";
import path from "path";

export const loadData = async (): Promise<CompaniesStockPricesType> => {
    try {
        const result = await Promise.all([
            fs.readFile(path.resolve(__dirname, "../data/amazon.json"), "utf-8"),
            fs.readFile(path.resolve(__dirname, "../data/google.json"), "utf-8"),
        ]);

        const amazon = JSON.parse(result[0]);
        const google = JSON.parse(result[1]);

        return { amazon, google };
    } catch (error) {
        console.error("error Loading Data", error);
        throw error;
    }
};
