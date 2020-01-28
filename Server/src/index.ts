import { config } from "dotenv";
import { join } from "path";
// import { fork, isMaster, on } from "cluster";
import logger from "./util/Logger";
import Server from "./boot/server";

config({
    path: join(__dirname, "..", ".env")
});

try {
    // if (isMaster && Number(process.env.CORES) >= 2) {
    //     for (let i = 0; i < Number(process.env.CORES); i++) fork();

    //     on("exit", (deadWorker, code, signal) => {
    //         logger.info(
    //             `Worker "${deadWorker.process.pid}" killed - Reason: ${signal} - Code: ${code}."`
    //         );
    //     });
    // } else {
    new Server().init();
    // }
} catch (ex) {
    logger.error(ex.message || ex);
    logger.error(__filename);
    throw new Error(ex.message);
}

logger.info("Application up and running");
