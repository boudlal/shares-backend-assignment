import express from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
const app = express();

const initServer = (port: number): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> => {
    return new Promise((resolve, reject) => {
        const server: Server<typeof IncomingMessage, typeof ServerResponse> = app
            .listen(port, () => {
                console.log(`Express is listening at http://localhost:${port}`);
                resolve(server);
            })
            .on("error", (error: Error) => {
                reject(error);
            });
    });
};

export default initServer;
