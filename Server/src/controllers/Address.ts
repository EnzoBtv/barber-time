import { Router, Request, Response } from "express";
import User from "../models/User";

import { Status } from "../constants/Status";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";

export default class AddressController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/addresses";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.put(this.path, privateRoute, this.store);
    }

    async store(req: Request, res: Response) {
        try {
            const { id } = req;
            const {
                zipCode,
                street,
                number,
                complement,
                city,
                state
            } = req.body;

            if (!zipCode || !street || !number || !city || !state) {
                logger.error("Address creation failed, missing parameters");
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }
            const user = await User.findByPk(id);

            if (!user) {
                logger.error("Address creation failed, user not found in db");
                return res.status(NOT_FOUND).json({
                    error:
                        "Usuário não encontrado no banco de dados, por favor, entre em contato com o suporte"
                });
            }

            const address = await user.createAddress({
                zipCode,
                street,
                number,
                complement,
                city,
                state
            });

            if (!address) {
                logger.error(
                    "Address creation failed, not possible to create address"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Não foi possível cadastrar o endereço no banco de dados, entre em contato com o suporte"
                });
            }

            res.status(SUCCESS).json(address);
        } catch (ex) {
            logger.error(`Error creating user | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }

    async show(req: Response, res: Response) {
        console.log(req, res);
    }
}
