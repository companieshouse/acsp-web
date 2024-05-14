import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, BASE_URL, LIMITED_SECTOR_YOU_WORK_IN } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM;

    try {
        // get data from mongo
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);

        res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
            previousPage,
            editPage: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
            title: "Confirm the correspondence address",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            correspondenceAddress: acspData?.correspondenceAddress
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};

    detailsAnswers.correspondenceAddress = acspData.correspondenceAddress?.propertyDetails + " " + acspData.correspondenceAddress?.line1 + "<br>" + acspData.correspondenceAddress?.country + "<br>" + acspData.correspondenceAddress?.postcode;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
    res.redirect(addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang));
};
