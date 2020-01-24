import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import logger from "../util/Logger";

import { TokenObject } from "../typings/Token";

import { Status } from "../constants/Status";

const { UNAUTHORIZED } = Status;

export default function auth(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const token = request.header("x-auth-token");
    const ip =
        request.header("x-forwarded-for") || request.connection.remoteAddress;

    if (!token)
        return response.status(UNAUTHORIZED).json({
            error: "Token inválido, por favor, realize o login novamente"
        });

    try {
        const decoded: TokenObject = <TokenObject>(
            verify(token, process.env.CLIENT_SECRET)
        );
        if (typeof decoded !== "string") {
            request.email = decoded.email;
            request.id = decoded.id;
        }

        next();
    } catch (e) {
        logger.warn(
            `Request to validate token ${token} from the ip ${ip} has failed.`
        );
        return response.status(UNAUTHORIZED).json({
            error: "Token inválido, por favor, realize o login novamente"
        });
    }
}
