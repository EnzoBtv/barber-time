import { Router } from "express";

export default class User {
    router: Router;
    path: string;
    constructor() {
        this.path = "/user";
        this.router = Router();
    }
}
