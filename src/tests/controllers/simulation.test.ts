import * as dataService from "../../services/data";
import * as simulationService from "../../services/simulation";
import { getSimulation } from "../../controllers/simulation";
import { createRequest, createResponse } from "node-mocks-http";

describe("SimulationController", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Get Simulation", () => {
        it("should call loadData and runSimulation then return statusCode 200, array of trades and performance time ", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData");
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation");
            const request = createRequest({
                query: { capital: 100000 },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();
            expect(loadDataSpy).toBeCalledTimes(1);
            expect(runSimulationSpy).toBeCalledTimes(1);
            expect(statusCode).toEqual(200);
            expect(Array.isArray(body.trades)).toEqual(true);
            expect(typeof body.performance).toEqual("number");
        });

        it("should not call loadData and runSimulation and return statusCode 400 if capital is undefined", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData");
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation");
            const request = createRequest({
                query: { capital: undefined },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadDataSpy).not.toBeCalled();
            expect(runSimulationSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(400);
        });

        it("should not call loadData and runSimulation and return statusCode 400 if capital is NaN", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData");
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation");
            const request = createRequest({
                query: { capital: NaN },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadDataSpy).not.toBeCalled();
            expect(runSimulationSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(400);
        });

        it("should not call loadData and runSimulation and return statusCode 400 if capital is 0", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData");
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation");
            const request = createRequest({
                query: { capital: 0 },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadDataSpy).not.toBeCalled();
            expect(runSimulationSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(400);
        });

        it("should call loadData and return status 500 and an error message if and error occured in loadData", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData").mockImplementation(() => {
                throw "error";
            });
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation");
            const request = createRequest({
                query: { capital: 100000 },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadDataSpy).toBeCalledTimes(1);
            expect(runSimulationSpy).not.toBeCalled();
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(500);
        });

        it("should call loadData and runSimulation and return status 500 and an error message if and error occured in runSimulation", async () => {
            // GIVEN
            const loadDataSpy = jest.spyOn(dataService, "loadData");
            const runSimulationSpy = jest.spyOn(simulationService, "runSimulation").mockImplementation(() => {
                throw "error";
            });
            const request = createRequest({
                query: { capital: 100000 },
            });
            const response = createResponse();

            // WHEN
            await getSimulation(request, response);

            // THEN
            const body = response._getJSONData();
            const statusCode = response._getStatusCode();

            expect(loadDataSpy).toBeCalledTimes(1);
            expect(runSimulationSpy).toBeCalledTimes(1);
            expect(typeof body.message).toEqual("string");
            expect(statusCode).toEqual(500);
        });
    });
});
