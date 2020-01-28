import { Sequelize } from "sequelize";
import { join } from "path";

import logger from "../util/Logger";
import { execPromise as exec } from "../util/ChildPromise";

class Database {
    connection: Sequelize;

    constructor() {
        this.connection = new Sequelize({
            dialect: "postgres",
            host: "localhost",
            username: "root",
            password: "root",
            database: "barber-time",
            define: {
                timestamps: true,
                underscored: true
            }
        });
    }

    async init() {
        try {
            const models = await exec(
                `ls ${join(__dirname, "..", "models")}`,
                {}
            );

            if (models.type === "success") {
                const { stdout } = models;
                const modelsArray = stdout.split("\n");

                const modelsMap = new Map<string, any>();

                for (const model of modelsArray) {
                    if (model) {
                        const reqModel = require(join(
                            __dirname,
                            "..",
                            "models",
                            model
                        ));
                        reqModel.default.initModel(this.connection);
                        modelsMap.set(model, reqModel.default);
                    }
                }

                for (let model of modelsMap.keys()) {
                    if (modelsMap.get(model)?.associate) {
                        modelsMap.get(model).associate(this.connection.models);
                    }
                }
            }
        } catch (ex) {
            logger.error("It wasn't possible to initialize the models");
            throw new Error(ex.message);
        }
    }
}

export default Database;
