import { config } from "dotenv";
import { join } from "path";
import logger from "./util/Logger";
import Server from "./boot/server";

config({
    path: join(__dirname, "..", ".env")
});
logger.info("Application up and running");
new Server();
