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
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    }

    async initControllers() {
        try {
            console.log("Trying no initialize all controllers");
            const controllers = await exec(
                `ls ${join(__dirname, "..", "controllers")}`,
                {}
            );
            if (controllers.type === "success") {
                const { stdout } = controllers;
                const controllerArray = stdout.split("\n");
                for (const controller of controllerArray) {
                    if (controller) {
                        console.log(`Initilizing ${controller} Controller`);
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
            throw new Error(
                `It wasn't possible to initialize the controllers, error: ${JSON.stringify(
                    ex
                )}`
            );
        }
    }
}
