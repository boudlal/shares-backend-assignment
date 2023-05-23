import dotenv from "dotenv";
dotenv.config();

import { initServer } from "./server";

const init = async () => {
    const PORT = parseInt(process.env.PORT || "1337");
    await initServer(PORT);
};

init();
