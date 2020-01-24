import { Router, Request, Response } from "express";
import User from "../models/User";

import { Status } from "../constants/Status";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, CONFLICT } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";

export default class UserController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/barbers";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.put(this.path, privateRoute, this.store);
    }

    async store(req: Request, res: Response) {
        try {
            const { _id } = req;
            const {
                zipCode,
                street,
                number,
                complement,
                city,
                state
            } = req.body;

            if (!zipCode || !street || !number || !city || !state) {
                logger.error("Barber update failed, missing parameters");
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }
        } catch (ex) {
            logger.error(`Error creating user | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }

    async show(req: Response, res: Response) {}
}
