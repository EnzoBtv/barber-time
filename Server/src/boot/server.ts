import Express, { Application, json } from "express";
import { join } from "path";

import Database from "../database";

import logger from "../util/Logger";
import { execPromise as exec } from "../util/ChildPromise";

export default class Server {
    app: Application;
    constructor() {
        this.app = Express();
    }

    async init() {
        await new Database().init();
        this.listen();
        this.initMiddlewares();
        await this.initControllers();
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            logger.info(`App listening on port ${process.env.PORT}`);
        });
    }

    async initMiddlewares() {
        this.app.use(json());
    }

    async initControllers() {
        try {
            logger.info("Trying no initialize all controllers");
            const controllers = await exec(
                `ls ${join(__dirname, "..", "controllers")}`,
                {}
            );
            if (controllers.type === "success") {
                const { stdout } = controllers;
                const controllerArray = stdout.split("\n");
                for (const controller of controllerArray) {
                    if (controller) {
                        logger.info(`Initilizing ${controller} Controller`);
                        const reqController = require(join(
                            __dirname,
                            "..",
                            "controllers",
                            controller
                        ));
                        this.app.use(new reqController.default().router);
                    }
                }
            }
        } catch (ex) {
            logger.error(
                `It wasn't possible to initialize the controllers, error: ${JSON.stringify(
                    ex
                )}`
            );
            throw new Error(JSON.stringify(ex));
        }
    }
}
