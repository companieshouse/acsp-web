import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_MEMBERSHIP_NUMBER, AML_BODY_DETAILS_CONFIRM, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { validationResult } from "express-validator";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const amlSupervisoryBodies = new Map<string, number>();
    const currentUrl = BASE_URL + AML_BODY_DETAILS_CONFIRM;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.CHECK_AML_DETAILS, {
            title: "Check the AML details",
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            currentUrl,
            editField: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            acspType: acspData?.typeOfBusiness,
            businessName: acspData?.businessName,
            amlSupervisoryBodies: acspData?.amlSupervisoryBodies
        });

    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
    // amlSupervisoryBodies.set("Association of Chartered Certified Accountants (ACCA)", 123);
    // amlSupervisoryBodies.set("Association of Accounting Technicians (AAT)", 456);
    // amlSupervisoryBodies.set("Association of International Accountants (AIA)", 789);
    // console.log("amlSupervisoryBodies1:", amlSupervisoryBodies.get("Association of Chartered Certified Accountants (ACCA)"));
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const nextPageUrl = addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang);
    res.redirect(nextPageUrl);
};
