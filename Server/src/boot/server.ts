import Express, { Application } from "express";
import { join } from "path";
import { execPromise as exec } from "../util/ChildPromise";
import "../database";

export default class Server {
    app: Application;
    constructor() {
        this.app = Express();
        (async () => {
            this.listen();
            await this.initControllers();
        })();
    }

    listen() {
        this.app.listen(process.env.PORT);
    }

    async initControllers() {
        try {
            const controllers = await exec(
                `ls ${join(__dirname, "..", "controllers")}`,
                {}
            );
            if (controllers.type === "success") {
                const { stdout } = controllers;
                const controllerArray = stdout.split("\n");
                for (const controller of controllerArray) {
                    if (controller) {
                        console.log(controller);
                        const reqController = require(join(
                            __dirname,
                            "..",
                            "controllers",
                            controller
                        ));
                        this.app.use(reqController.router);
                    }
                }
            }
        } catch (ex) {
            throw new Error(JSON.stringify(ex));
        }
    }
}
