declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        CLIENT_SECRET: string;
    }
}

declare namespace Express {
    export interface Request {
        email?: string;
        _id?: string;
    }
}
