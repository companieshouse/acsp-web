import { NextFunction, Request, Response } from "express";
import * as config from "../config";

/**
 * Handler for GET request to the accessibility statement page.
 * Renders the page with relevant data.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.ACCESSIBILITY_STATEMENT, {
        title: "Accessibility statement for the Companies House service"
    });
};
