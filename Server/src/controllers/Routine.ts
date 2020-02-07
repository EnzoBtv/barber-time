import { Router, Request, Response } from "express";
import { each } from "bluebird";

import Hour from "../models/Hour";

import { Status } from "../typings/Status";
import { IController } from "../typings/Controller";
import { IDay } from "../typings/Day";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";

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
        /**
         * Como para o estabelecimento a rotina se estabelece de segunda a segunda, os dias serão tratados como sendo de segunda a segunda
         * e não como um mês completo.
         */
        const { id } = req;
        const days: IDay = <IDay>req.body.days;
        if (!days || !id) {
            logger.error("Routine#store failed due to missing parameters");
            return res
                .status(BAD_REQUEST)
                .json({ error: "Estão faltando parâmetros na requisição" });
        }

        await each(Object.keys(days), async (day: string) => {
            await each(days[day].hours, async (hour: string) => {
                Hour.findOrCreate({
                    where: {
                        day: days[day].type,
                        hour: hour
                    }
                });
            });
        });
    }
}
