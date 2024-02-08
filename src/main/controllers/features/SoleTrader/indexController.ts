import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { SOLE_TRADER_TYPE_OFBUSINESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.HOME, { title: "Apply to register as a Companies House authorised agent" });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(SOLE_TRADER_TYPE_OFBUSINESS);
};
