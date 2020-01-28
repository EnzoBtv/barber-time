import { Router, Request, Response } from "express";

import User from "../models/User";

import { Status } from "../typings/Status";
import { TokenType, createOrUpdateToken } from "../typings/Token";
import { IController } from "../typings/Controller";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;
const { RECOVER_PASSWORD } = TokenType;

import logger from "../util/Logger";
import Mailer from "../util/Email";

export default class AddressController implements IController {
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
            const { email } = req.body;

            const ip =
                req.header("x-forwarded-for") || req.connection.remoteAddress;

            if (!email) {
                logger.error(
                    "ForgotPassword creation failed, missing parameters"
                );
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
                    `ForgotPassword creation failed, user not found for email ${email}`
                );
                return res.status(NOT_FOUND).json({
                    error: "Email não cadastrado no sistema"
                });
            }

            const token = await createOrUpdateToken(
                { id: user.id },
                user,
                RECOVER_PASSWORD,
                ip
            );

            await new Mailer(
                user.email,
                "Recuperação de senha Barber Time",
                "",
                `<h1>
                    Olá ${user.name}, tudo bem?
                </h1>
                <p>
                    Parece que você solicitou uma recuperação de senha, 
                    clique no link a seguir para continuar com o processo:

                    <a href="${process.env.FRONT_URL}/reset/password/${token}">Clique aqui</a>
                </p>
                <br />
                <br />
                <p>
                    Sinta-se a vontade para responder esse email. 
                    E se você não pediu a recuperação de senha, apenas ignore esse email
                </p>`
            ).send();

            return res.status(SUCCESS).json({ token });
        } catch (ex) {
            logger.error(`Error creating session | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
