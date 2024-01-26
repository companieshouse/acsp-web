import { NextFunction, Request, Response, Router } from "express";
import { HomeService } from "../../../services/index/homeService";
import * as config from "../../../config";

// const indexController = Router();

export const get = async (req: Request, res: Response) => {
    const handler = new HomeService();
    const viewData = await handler.execute(req, res);
    res.render(config.HOME, viewData);
};

// indexController.get(HOME, async (req: Request, res: Response, next: NextFunction) => {
//     const handler = new HomeService();
//     const viewData = await handler.execute(req, res);
//     res.render('/home', viewData);
// });
