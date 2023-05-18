import dotenv from "dotenv";
dotenv.config();

import server from "./server";

const init = async () => {
    const PORT = parseInt(process.env.PORT || "1337");
    await server(PORT);
};

init();
