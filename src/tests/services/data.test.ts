import fs from "fs";
import { CompanyEnum } from "../../types/TradeTypes";
import * as dataService from "../../services/data";

describe("Data service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("loadData", () => {
        test("should return an object that contains companies, and each company is an array ", async () => {
            const spy = jest.spyOn(fs.promises, "readFile");

            const result = await dataService.loadData();
            const currentCompanies = Object.values(CompanyEnum);

            expect(spy).toBeCalledTimes(2);
            expect(Object.keys(result)).toEqual(currentCompanies);

            for (let i = 0; i < currentCompanies.length; i++) {
                const company = currentCompanies[i];
                expect(Array.isArray(result[company]));
            }
        });

        test("should throw an error if an error occured while reading data files", () => {
            jest.spyOn(fs.promises, "readFile").mockImplementation(() => {
                throw "error";
            });

            expect(dataService.loadData()).rejects.toMatch("error");
        });

        test("should throw an error if an error occured while parsing json", () => {
            jest.spyOn(JSON, "parse").mockImplementation(() => {
                throw "error";
            });

            expect(dataService.loadData()).rejects.toMatch("error");
        });
    });
});
