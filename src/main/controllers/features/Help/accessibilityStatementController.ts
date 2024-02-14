import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { ACCESSIBILITY_STATEMENT } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.ACCESSIBILITY_STATEMENT, { title: "Accessibility statement for the Companies House service" });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(ACCESSIBILITY_STATEMENT);
};
