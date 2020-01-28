import { Router, Request, Response } from "express";
export interface IController {
    path: string;
    router: Router;

    store?: (req: Request, res: Response) => Promise<Response>;
    show?: (req: Request, res: Response) => Promise<Response>;
    index?: (req: Request, res: Response) => Promise<Response>;
    update?: (req: Request, res: Response) => Promise<Response>;
}
