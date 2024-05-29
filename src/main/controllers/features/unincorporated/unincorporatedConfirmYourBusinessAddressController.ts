import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { ErrorService } from "../../../services/errorService";
import logger from "../../../../../lib/Logger";
import { businessAddressAnswers } from "../../../services/checkYourAnswersService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
            editAddress: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang),
            title: "Confirm the business address",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            businessAddress: acspData?.businessAddress
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    await businessAddressAnswers(req, acspData);

    res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang));
};
