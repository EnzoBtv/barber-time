import { Router, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import User from "../models/User";

import { Status } from "../constants/Status";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;

import logger from "../util/Logger";
import Password from "../util/Password";

export default class AddressController {
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
                logger.error("Error creating session, missing parameters");
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
                    `Error creating session, user not found for email ${email}`
                );
                return res.status(NOT_FOUND).json({
                    error: "Email não cadastrado no sistema"
                });
            }

            if (!new Password(password, user.password).checkEquality()) {
                logger.error(
                    `Error creating session, incorrect password for email ${email}`
                );
                return res.status(BAD_REQUEST).json({
                    error: "Senha incorreta, por favor, tente novamente"
                });
            }

            const token = sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.CLIENT_SECRET,
                {
                    expiresIn: 3600
                }
            );

            const tokenDb = await user.createTokens({
                ip,
                token
            });

            if (!tokenDb) {
                logger.error(
                    `Error creating session, it wasn't possible to create the token`
                );
                return res.status(BAD_REQUEST).json({
                    error:
                        "Não foi possível gerar o token de logxin, por favor, entre em contato com o suporte"
                });
            }

            return res.status(SUCCESS).json({ token });
        } catch (ex) {
            logger.error(`Error creating session | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
