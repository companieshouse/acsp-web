import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CsrfError } from "@companieshouse/web-security-node";
import { ErrorService } from "../services/errorService";
import { getLocalesService, selectLang } from "../utils/localise";
import logger from "../utils/logger";
import { CHS_URL } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../types/pageURL";

export const httpErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 401) {
        logger.errorRequest(
            req,
            `A ${err.httpStatusCode} error occurred when a ${req.method} request was made to ${req.originalUrl}. Re-directing to ${BASE_URL}${CHECK_SAVED_APPLICATION}`
        );
        res.redirect(`${CHS_URL}/signin?return_to=${BASE_URL}${CHECK_SAVED_APPLICATION}`);
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
