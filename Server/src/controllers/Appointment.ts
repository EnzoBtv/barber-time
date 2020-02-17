import { Router, Request, Response } from "express";

import User from "../models/User";
import Appointment from "../models/Appointment";

import { Status } from "../typings/Status";
import { WeekDays } from "../typings/Day";
import { IController } from "../typings/Controller";

const {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    CREATED,
    CONFLICT,
    NOT_ALLOWED
} = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";
import { hasKey } from "../util/Object";

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
     * ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$ hour regex
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
            const establishment = await User.findByPk(establishmentId, {
                include: [
                    {
                        association: "hours"
                    }
                ]
            });

            if (!user) {
                logger.error(
                    "Appointment#store failed due to user not found in db"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Usuário não encontrado no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            if (
                !establishment ||
                !establishment.hours ||
                !establishment.hours.length
            ) {
                logger.error(
                    "Appointment#store failed due to establishment not found in db"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Estabelecimento não encontrado ou sem cadastro de horário no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            date.setSeconds(0);
            date.setMilliseconds(0);

            let weekDay = <string>(<unknown>date.getDay());
            if (hasKey(WeekDays, weekDay)) {
                weekDay = WeekDays[weekDay];
            }

            const appointments = await establishment.getEstablishmentAppointments();

            let hasHour = true;
            for (const appointment of appointments) {
                if (appointment.date.toISOString() === date.toISOString()) {
                    hasHour = false;
                    break;
                }
            }

            if (!hasHour) {
                logger.error(
                    "Appointment#store failed due to hour have already been chosen"
                );
                return res.status(CONFLICT).json({
                    error:
                        "O horário selecionado já foi escolhido, tente escolher outro"
                });
            }

            hasHour = false;
            for (const hour of establishment.hours) {
                if (
                    hour.day === weekDay &&
                    hour.hour === `${date.getHours()}:${date.getMinutes()}`
                ) {
                    hasHour = true;
                    break;
                }
            }

            if (!hasHour) {
                logger.error(
                    "Appointment#store failed due to establishment doesn't have the selected hour"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "O Estabelecimento escolhido não tem essa hora disponível, tente escolher outra."
                });
            }

            if (user.type === "barber") {
                logger.error(
                    "Appointment#store failed due to barber trying to create an appointment"
                );
                return res.status(NOT_ALLOWED).json({
                    error: "Você não tem autorização de criar um compromisso"
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
