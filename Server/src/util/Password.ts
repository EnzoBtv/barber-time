import { enc, SHA512 } from "crypto-js";
export default class Password {
    dbPassword?: string;
    inputPassword: string;
    constructor(inputPassword: string, dbPassword?: string) {
        if (dbPassword && inputPassword) {
            this.dbPassword = dbPassword;
        }
        this.inputPassword = enc.Base64.stringify(SHA512(inputPassword));
    }

    checkEquality() {
        return this.dbPassword === this.inputPassword;
    }
}
