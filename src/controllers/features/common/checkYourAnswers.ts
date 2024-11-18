import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, BASE_URL, CHECK_YOUR_ANSWERS, CONFIRMATION, YOUR_RESPONSIBILITIES } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, NO_PAYMENT_RESOURCE_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { closeTransaction } from "../../../services/transactions/transaction_service";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { startPaymentsSession } from "../../../services/paymentService";
import logger, { createAndLogError } from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { getAnswers } from "../../../services/checkYourAnswersService";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + CHECK_YOUR_ANSWERS;
    try {
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        const detailsAnswers: Answers = getAnswers(req, acspData, locales.i18nCh.resolveNamespacesKeys(lang));
        res.render(config.CHECK_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(BASE_URL + YOUR_RESPONSIBILITIES, lang),
            editAML: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            typeOfBusiness: acspData.typeOfBusiness,
            detailsAnswers,
            lang,
            amlDetails: acspData?.amlSupervisoryBodies,
            amlName: acspData.howAreYouRegisteredWithAml,
            AMLSupervisoryBodies
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Clicking continue to payment on Check Your Answers Page");
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + CHECK_YOUR_ANSWERS;
    try {
        const transactionId: string = session.getExtraData(SUBMISSION_ID)!;
        const paymentUrl: string | undefined = await closeTransaction(session, transactionId);

        if (!paymentUrl) {
            return res.redirect(addLangToUrl(BASE_URL + CONFIRMATION, lang));
        } else {
            const paymentResponse: ApiResponse<Payment> = await startPaymentsSession(session, paymentUrl,
                transactionId);

            if (!paymentResponse.resource) {
                return next(createAndLogError(NO_PAYMENT_RESOURCE_ERROR));
            }

            res.redirect(paymentResponse.resource.links.journey);
        }

    } catch (err) {
        logger.error("Error starting payment session " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
