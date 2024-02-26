import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { BASE_URL, SOLE_TRADER_TYPE_OF_BUSINESS } from "../../../types/pageURL";
import logger from "../../../../../lib/Logger";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("------------------here---------------------");
    res.render(config.HOME, { title: "Apply to register as a Companies House authorised agent" });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS);
};
