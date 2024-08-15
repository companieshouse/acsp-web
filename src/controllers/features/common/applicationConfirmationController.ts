import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { CONFIRMATION, BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + CONFIRMATION;
    try {
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        const transactionId: string = session.getExtraData(SUBMISSION_ID)!;

        res.render(config.APPLICATION_CONFIRMATION, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            feedbackLink: "https://www.smartsurvey.co.uk/s/reg-as-acsp-confirmation/",
            email: res.locals.userEmail,
            transactionId
        });

    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
