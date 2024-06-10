import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_MEMBERSHIP_NUMBER, AML_BODY_DETAILS_CONFIRM, YOUR_RESPONSIBILITIES } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + AML_BODY_DETAILS_CONFIRM;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        const url = "/register-as-companies-house-authorised-agent/aml-membership-number";
        res.render(config.CHECK_AML_DETAILS, {
            title: locales.i18nCh.resolveNamespacesKeys(lang).checkAmlDetailsTabHeading,
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            currentUrl,
            amlSupervisoryBodies: acspData?.amlSupervisoryBodies,
            typeOfBusiness: acspData?.typeOfBusiness,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            businessName: acspData?.businessName,
            url
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const nextPageUrl = addLangToUrl(BASE_URL + YOUR_RESPONSIBILITIES, lang);
    res.redirect(nextPageUrl);
};
