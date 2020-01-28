declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        CLIENT_SECRET: string;
        CORES: string;
    }
}

declare namespace Express {
    export interface Request {
        email?: string;
        id?: number;
    }
}
