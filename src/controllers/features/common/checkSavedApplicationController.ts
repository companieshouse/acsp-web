import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl, getLocalesService } from "../../../utils/localise";
import { BASE_URL, CANNOT_REGISTER_AGAIN, CANNOT_SUBMIT_ANOTHER_APPLICATION, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { getSavedApplication } from "../../../services/transactions/transaction_service";
import { deleteAcspApplication } from "../../../services/acspRegistrationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const savedApplication : Resource<TransactionList> | ApiErrorResponse = await getSavedApplication(session, res.locals.userId);
    logger.debug("savedApplication: " + savedApplication);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    if (savedApplication.httpStatusCode === 200) {
        logger.debug("saved application exists");
        const transactionlistResource = savedApplication as Resource<TransactionList>;
        const transactionList = transactionlistResource.resource;
        const redirectionUrl = getRedirectionUrl(transactionList, session, res, locales, lang);
        res.redirect(addLangToUrl(await redirectionUrl, lang));
    } else if (savedApplication.httpStatusCode === 404) {
        logger.debug("its a new application");
        res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
    } else {
        logger.error("internal server error: " + savedApplication.httpStatusCode);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
    }
};

const getRedirectionUrl = async (transactionList: TransactionList|undefined, session: Session, res: Response, locales:any, lang:string): Promise<string> => {
    const transaction = transactionList?.items[transactionList?.items.length - 1];
    var url = "";
    if (transaction?.status !== "closed") {
        logger.debug("application is open");
        url = BASE_URL + SAVED_APPLICATION;
    } else if (transaction.filings![transaction.id + "-1"]?.status === "rejected") {
        logger.debug("application is rejected");
        try {
            await deleteAcspApplication(session, res.locals.userId);
            url = BASE_URL + TYPE_OF_BUSINESS;
        } catch (error) {
            logger.error("Error deleting ACSP application ");
            const exception = new ErrorService();
            exception.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
        }
    } else if (transaction.filings![transaction.id + "-1"]?.status === "approved") {
        logger.debug("application is approved");
        url = BASE_URL + CANNOT_REGISTER_AGAIN;
    } else {
        logger.debug("application is in progress");
        url = BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION;
    }
    return url;
};
