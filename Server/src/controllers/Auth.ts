import { Router, Request, Response } from "express";

import User from "../models/User";

import { Status } from "../typings/Status";
import { TokenType, createOrUpdateToken } from "../typings/Token";
import { IController } from "../typings/Controller";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;
const { AUTH } = TokenType;

import logger from "../util/Logger";
import Password from "../typings/Password";

export default class AuthController implements IController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/auth";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post(this.path, this.store);
    }

    async store(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const ip =
                req.header("x-forwarded-for") || req.connection.remoteAddress;

            if (!email || !password) {
                logger.error("Auth#store failed due to missing parameters");
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }

            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (!user) {
                logger.error(
                    `Auth#store failed due to user not found for email ${email}`
                );
                return res.status(NOT_FOUND).json({
                    error: "Email não cadastrado no sistema"
                });
            }

            if (!new Password(password, user.password).checkEquality()) {
                logger.error(
                    `Auth#store failed due to incorrect password for email ${email}`
                );
                return res.status(BAD_REQUEST).json({
                    error: "Senha incorreta, por favor, tente novamente"
                });
            }

            const token = await createOrUpdateToken(
                {
                    id: user.id,
                    email: user.email
                },
                user,
                AUTH,
                ip
            );

            return res.status(SUCCESS).json({ token });
        } catch (ex) {
            logger.error(
                `Auth#store failed | Error ${ex.message} | Stack ${ex.stack}`
            );
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
