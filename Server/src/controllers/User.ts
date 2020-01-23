import { Router, Request, Response } from "express";
import User from "../models/User";

import { Status } from "../constants/Status";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR } = Status;

import logger from "../util/Logger";

export default class UserController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/users";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post(this.path, this.store);
    }

    async store(req: Request, res: Response) {
        try {
            const { email, name, type, password } = req.body;

            if (!email || !name || !type || !password) {
                logger.error("User creation failed, missing parameters");
                res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }

            const user = await User.create({
                name,
                email,
                type,
                password
            });

            if (!user) {
                logger.error("User creation failed, database failed");
                res.status(INTERNAL_SERVER_ERROR).json({
                    error:
                        "Não foi possível criar o usuário, por favor, entre em contato com o suporte"
                });
            }

            res.status(SUCCESS).json(user);
        } catch (ex) {
            logger.error(`Error creating user | Error ${ex.message}`);
            res.status(INTERNAL_SERVER_ERROR).json({ error: ex.message });
        }
    }
}
