import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl, getLocalesService } from "../../../utils/localise";
import { BASE_URL, CANNOT_SUBMIT_ANOTHER_APPLICATION, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getSavedApplication } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const savedApplication : Resource<TransactionList> | ApiErrorResponse = await getSavedApplication(session, res.locals.userId); 
    console.log("saved application--------->", savedApplication);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

     if (savedApplication.httpStatusCode === 200) {
        const transactionlistResource = savedApplication as Resource<TransactionList>;
        console.log("transactionlistResource-------->", transactionlistResource);
        const transactionList =  transactionlistResource.resource;
        console.log("transactionList-------->", transactionList);
        if (transactionList?.items.length === 0){
           console.log("its a new application-------->");
           res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
        } else {
           const transaction = transactionList?.items[transactionList?.items.length - 1];
           if (transaction?.status !== "closed"){
             console.log("application is in progress-------->");
             res.redirect(addLangToUrl(BASE_URL + SAVED_APPLICATION, lang));
           } else if (transaction.filings?.get(transaction.id + "-1")?.status  === "rejected"){
             console.log("application is rejected-------->");
             //need to delete application
             res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
           } else {
             console.log("application is approved-------->");
             //redirect to kickout screen
           }
        }
     } else if (savedApplication.httpStatusCode === 404) {
         logger.error(`not found: ` + savedApplication.httpStatusCode);
         const error = new ErrorService();
         error.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
     } else {
         logger.error(`internal server error: ` + savedApplication.httpStatusCode);
         const error = new ErrorService();
         error.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
     }
};
