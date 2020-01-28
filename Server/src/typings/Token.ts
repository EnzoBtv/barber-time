import { sign } from "jsonwebtoken";
import Token from "../models/Token";
import User from "../models/User";

export interface TokenObject {
    email: string;
    id: number;
}

export enum TokenType {
    AUTH = "auth",
    RECOVER_PASSWORD = "recover_password"
}

export async function createOrUpdateToken(
    payload: { [key: string]: any },
    user: User,
    type: string,
    ip: string = ""
) {
    const token = sign(payload, process.env.CLIENT_SECRET, { expiresIn: 3600 });

    const oldToken = await Token.findOne({
        where: {
            user_id: user.id,
            type: type
        }
    });

    if (oldToken) {
        oldToken.token = token;
        await oldToken.save();
    } else {
        const tokenDb = await Token.create({
            ip,
            token,
            type: type
        });

        await user.addToken(tokenDb);
    }
    return token;
}
