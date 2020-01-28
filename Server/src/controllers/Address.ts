import { Router, Request, Response } from "express";
import RequestP from "request-promise";

import User from "../models/User";
import Address from "../models/Address";

import { Status } from "../typings/Status";
import { IController } from "../typings/Controller";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;

import privateRoute from "../middlewares/Private";

import logger from "../util/Logger";

import { ViaCep, AddressDB } from "../typings/Address";

export default class AddressController implements IController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/addresses";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post(this.path, privateRoute, this.store);
        this.router.get(`${this.path}/cep`, privateRoute);
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
            const address = await Address.create({
                zipCode,
                street,
                number,
                complement,
                city,
                state
            });

            await user.addAddress(address);

            if (!address) {
                logger.error(
                    "Address creation failed, not possible to create address"
                );
                return res.status(NOT_FOUND).json({
                    error:
                        "Não foi possível cadastrar o endereço no banco de dados, entre em contato com o suporte"
                });
            }

            return res.status(SUCCESS).json(address);
        } catch (ex) {
            logger.error(`Error creating user | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { cep } = req.body;

            if (!cep) {
                logger.error("CEP find failed, missing parameters");
                return res.status(BAD_REQUEST).json({
                    error: "Estão faltando parâmetros na requisição"
                });
            }
            const address: ViaCep = <ViaCep>(<unknown>RequestP({
                url: `https://viacep.com.br/ws/${cep}/json/`,
                method: "GET",
                rejectUnauthorized: true
            }));
            const responseObj: AddressDB = {
                zipCode: address.cep,
                street: address.logradouro,
                complement: address.complemento,
                city: address.localidade,
                state: address.uf
            };

            return res.status(SUCCESS).json(responseObj);
        } catch (ex) {
            logger.error(`CEP find failed | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
