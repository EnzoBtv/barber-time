import { Router, Request, Response } from "express";
import User from "../models/User";

import { Status } from "../typings/Status";
import { IController } from "../typings/Controller";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, CONFLICT } = Status;

import logger from "../util/Logger";
import Password from "../typings/Password";

export default class UserController implements IController {
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
                logger.error("User#store failed due to missing parameters");
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }

            const oldUser = await User.findOne({
                where: {
                    email
                }
            });

            if (oldUser) {
                logger.error(
                    "User#store failed due to there's already an user registered with this email"
                );
                return res.status(CONFLICT).json({
                    error:
                        "Não foi possível criar o usuário pois já existe outro com o mesmo email"
                });
            }

            const hashedPassword = new Password(password).inputPassword;
            const user = await User.create({
                name,
                email,
                type,
                password: hashedPassword
            });

            if (!user) {
                logger.error("User#store failed due to database failed");
                return res.status(INTERNAL_SERVER_ERROR).json({
                    error:
                        "Não foi possível criar o usuário, por favor, entre em contato com o suporte"
                });
            }

            return res.status(SUCCESS).json(user);
        } catch (ex) {
            logger.error(
                `User#store failed | Error ${ex.message} | Stack ${ex.stack}`
            );
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
