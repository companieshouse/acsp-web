import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderNameService } from "../../../services/capture-name/soleTraderNameService";
import { SOLE_TRADER_NAME } from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const nameService = new SoleTraderNameService();
    const viewData = await nameService.execute(req, res, next);
    res.render(SOLE_TRADER_NAME, viewData);
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const nameService = new SoleTraderNameService();
    const viewData = await nameService.execute(req, res, next).then(() => {
        return res.redirect("/sole-trader/date-of-birth");
    }).catch(viewData => {
        res.status(400).render(SOLE_TRADER_NAME, viewData);
    });
};
