import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, SOLE_TRADER_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM;

    try {
        // get data from mongodb
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);

        res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
            previousPage,
            editPage: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            correspondenceAddress: acspData?.applicantDetails?.correspondenceAddress,
            typeOfBusiness: acspData?.typeOfBusiness
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR, lang));
};
