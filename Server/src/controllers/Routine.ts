import { Router, Request, Response } from "express";
import { each } from "bluebird";

import Hour from "../models/Hour";

import { Status } from "../typings/Status";
import { IController } from "../typings/Controller";
import { IDay } from "../typings/Day";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";
import User from "../models/User";

export default class RoutineController implements IController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/schedule";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post(this.path, privateRoute, this.store);
    }

    async store(req: Request, res: Response) {
        try {
            const { id } = req;
            const days: IDay[] = req.body.days;
            if (!days || !id) {
                logger.error("Routine#store failed due to missing parameters");
                return res
                    .status(BAD_REQUEST)
                    .json({ error: "Estão faltando parâmetros na requisição" });
            }

            const user = await User.findByPk(id);

            if (!user) {
                logger.error("Routine#store failed due to not found user");

                return res.status(NOT_FOUND).json({
                    error:
                        "Usuário não encontrado no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            await each(days, async (day: IDay) => {
                await each(day.hours, async (hour: string) => {
                    const [hourDb] = await Hour.findOrCreate({
                        where: {
                            day: day.type,
                            hour: hour
                        }
                    });

                    await user.addHour(hourDb);
                });
            });

            return res.status(CREATED).json({ success: true });
        } catch (ex) {
            logger.error(
                `Routine#store failed | Error ${ex.message} | Stack ${ex.stack}`
            );
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
