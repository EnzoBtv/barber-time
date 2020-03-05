declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        CLIENT_SECRET: string;
        CORES: string;
        EMAIL_USER: string;
        EMAIL_PASSWORD: string;
        FRONT_URL: string;
        SENTRY_URL: string;
    }
}

declare namespace Express {
    export interface Request {
        email?: string;
        id?: number;
    }
}
