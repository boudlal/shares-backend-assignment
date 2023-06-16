import app, { initServer } from "../server";
import { Server, IncomingMessage, ServerResponse } from "http";
import { AddressInfo } from "net";
import supertest from "supertest";
import { CompanyEnum } from "../types/TradeTypes";

describe("Test Server Listening", () => {
    const PORT = 1337;
    let server: Server<typeof IncomingMessage, typeof ServerResponse>;

    afterAll(() => {
        server?.close();
    });

    describe("Init Server", () => {
        it("should start listening on the specified port", async () => {
            // WHEN
            server = await initServer(PORT);
            const { port } = server.address() as AddressInfo;

            // THEN
            expect(server.listening).toEqual(true);
            expect(port).toEqual(PORT);
        });

        it("should throw an error if the port provided is already busy", async () => {
            await expect(initServer(PORT)).rejects.toThrow(); // listening in a port that already in use: 1337
        });

        it("should throw an error if the port provided is not a valid", async () => {
            await expect(initServer(NaN)).rejects.toThrow(); // listening in a port that already in use: 1337
        });
    });

    describe("/simulate", () => {
        it("should return statusCode 200, array of trades and performance time ", async () => {
            // GIVEN
            const capital = 100000;

            // WHEN
            const result = await supertest(app).get("/simulate").query({ capital }).expect(200);

            // THEN
            expect(Array.isArray(result.body?.trades)).toEqual(true);
            expect(typeof result.body?.performance).toEqual("number");
            expect(result.body?.performance).toBeGreaterThan(0);
        });

        it("should return statusCode 400 if capital is undefined", async () => {
            //WHEN
            const result = await supertest(app).get("/simulate").expect(400);

            // THEN
            expect(typeof result.body.message).toEqual("string");
        });

        it("should return statusCode 400 if capital is NaN", async () => {
            //GIVEN
            const capital = "hello";

            //WHEN
            const result = await supertest(app).get("/simulate").query({ capital }).expect(400);

            // THEN
            expect(typeof result.body.message).toEqual("string");
        });

        it("should return statusCode 400 if capital is 0", async () => {
            // GIVEN
            const capital = 0;

            //WHEN
            const result = await supertest(app).get("/simulate").query({ capital }).expect(400);

            // THEN
            expect(typeof result.body.message).toEqual("string");
        });
    });

    describe("/stats", () => {
        it("should return statusCode 200, averages and bestTrade ", async () => {
            // WHEN
            const result = await supertest(app).get("/stats").expect(200);

            // THEN
            expect(Array.isArray(result.body?.averages[CompanyEnum.AMAZON])).toEqual(true);
            expect(Array.isArray(result.body?.averages[CompanyEnum.GOOGLE])).toEqual(true);
            expect(Object.keys(result.body?.bestTrade)).toEqual(Object.values(CompanyEnum));
        });
    });
});
