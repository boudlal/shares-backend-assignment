import express from "express";
import cors from "cors";
import { Server, IncomingMessage, ServerResponse } from "http";
import { getSimulation } from "../controllers/simulation";
import { getStats } from "../controllers/stats";
const app = express();
app.use(cors());

export const initServer = (port: number): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> => {
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

app.get("/simulate", getSimulation);
app.get("/stats", getStats);

export default app;
