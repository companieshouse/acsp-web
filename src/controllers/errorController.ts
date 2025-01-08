import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { CsrfError, InvalidAcspNumberError } from "@companieshouse/web-security-node";
import { ErrorService } from "../services/errorService";
import { getLocalesService, selectLang } from "../utils/localise";
import logger from "../utils/logger";

/*  This controller catches and logs HTTP errors from the http-errors module.
    It returns an error template back to the user.

    We can update the logic and the content of the template returned based on, for example:
    -  http error status codes:
            if (err.statusCode === 401) ...
    -  content of the message
            if (err.message?.includes(...
    -  type of HttpError thrown
            if (err instanceof Unauthorized)...
    - Any custom properties on the error
            if (!err.expose)...
*/

export const csrfErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next:NextFunction) => {
    if (err instanceof CsrfError) {
        logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
        const errorService = new ErrorService();
        errorService.render403Page(res, getLocalesService(), selectLang(req.query.lang), req.url);
    } else {
        next(err);
    }
};

export default [csrfErrorHandler];
