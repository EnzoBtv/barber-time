import { Router, Request, Response } from "express";
import User from "../models/User";

import { Status } from "../constants/Status";

const { BAD_REQUEST, SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND } = Status;

import logger from "../util/Logger";

export default class AddressController {
    router: Router;
    path: string;
    constructor() {
        this.path = "/auth";
        this.router = Router();
        this.init();
    }

    init() {
        this.router.put(this.path, this.store);
    }

    async store(req: Request, res: Response) {
        try {
        } catch (ex) {
            logger.error(`Error creating session | Error ${ex.message}`);
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ error: ex.message });
        }
    }
}
