import app from "../server";
import { Server, IncomingMessage, ServerResponse } from "http";
import { AddressInfo } from "net";

describe("Test Server Listening", () => {
    const PORT = 1337;
    let server: Server<typeof IncomingMessage, typeof ServerResponse>;

    afterAll(() => {
        server?.close();
    });

    it("should start listening on the specified port", async () => {
        // WHEN
        server = await app(PORT);

        // THEN
        const { port } = server.address() as AddressInfo;
        expect(server.listening).toEqual(true);
        expect(port).toEqual(PORT);
    });

    it("should throw an error if the port provided is already busy", async () => {
        await expect(app(PORT)).rejects.toThrow(); // listening in a port that already in use: 1337
    });

    it("should throw an error if the port provided is not a valid", async () => {
        await expect(app(NaN)).rejects.toThrow(); // listening in a port that already in use: 1337
    });
});
