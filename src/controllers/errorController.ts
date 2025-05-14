import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CsrfError } from "@companieshouse/web-security-node";
import { ErrorService } from "../services/errorService";
import { getLocalesService, selectLang } from "../utils/localise";
import logger from "../utils/logger";
import { CHS_URL } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION, CLOSE_ACSP_BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../types/pageURL";

export const httpErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 401) {

        let redirectUrl;
        if (req.originalUrl.includes(UPDATE_ACSP_DETAILS_BASE_URL)) {
            redirectUrl = UPDATE_ACSP_DETAILS_BASE_URL;
        } else if (req.originalUrl.includes(CLOSE_ACSP_BASE_URL)) {
            redirectUrl = CLOSE_ACSP_BASE_URL;
        } else {
            redirectUrl = BASE_URL + CHECK_SAVED_APPLICATION;
        }

        logger.errorRequest(
            req,
            `A ${err.httpStatusCode} error occurred when a ${req.method} request was made to ${req.originalUrl}. Re-directing to ${redirectUrl}`
        );
        res.redirect(`${CHS_URL}/signin?return_to=${redirectUrl}`);
    } else {
        next(err);
    }
};

export const csrfErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next:NextFunction) => {
    if (err instanceof CsrfError) {
        logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
        const errorService = new ErrorService();
        errorService.render403Page(res, getLocalesService(), selectLang(req.query.lang), req.url);
    } else {
        next(err);
    }
};

export const unhandledErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const errorService = new ErrorService();
    errorService.renderErrorPage(res, getLocalesService(), selectLang(req.query.lang), req.url);
};

export default [httpErrorHandler, csrfErrorHandler, unhandledErrorHandler];
