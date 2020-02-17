import { Router, Request, Response } from "express";

import User from "../models/User";
import Appointment from "../models/Appointment";

import { Status } from "../typings/Status";
import { IController } from "../typings/Controller";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";

export default class RoutineController implements IController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/appointment";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post(this.path, privateRoute, this.store);
    }

    /**
     * @TODO Add Hour and user type validation
     */
    async store(req: Request, res: Response) {
        try {
            const { id } = req;

            const date: Date = new Date(req.body.dateAppointment);
            const establishmentId: number = req.body.establishmentId;

            if (!date || !id || !establishmentId) {
                logger.error(
                    "Appointment#store failed due to missing parameters"
                );
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }

            const user = await User.findByPk(id);
            const establishment = await User.findByPk(establishmentId);

            if (!user) {
                logger.error(
                    "Appointment#store failed due to user not found in db"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Usuário não encontrado no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            if (!establishment) {
                logger.error(
                    "Appointment#store failed due to establishment not found in db"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Estabelecimento não encontrado no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            const appointment = await Appointment.create({
                date
            });

            await user.addAppointment(appointment);

            await establishment.addEstablishmentAppointment(appointment);

            return res.status(CREATED).json(appointment);
        } catch (ex) {
            logger.error(
                `Appointment#store failed | Error ${ex.message} | Stack ${ex.stack}`
            );
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
