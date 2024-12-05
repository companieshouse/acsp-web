import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { getAnswers } from "../../../services/checkYourAnswersService";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UPDATE_YOUR_ANSWERS;
    try {
        // TO DO -- this code needs to be modified once the API development is completed
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        const detailsAnswers: Answers = getAnswers(req, acspData, locales.i18nCh.resolveNamespacesKeys(lang));
        // -----------------------------------------------------------------------------
        res.render(config.UPDATE_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL, lang),
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
