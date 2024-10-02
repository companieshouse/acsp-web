import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, BASE_URL, UNINCORPORATED_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { APPLICATION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

const util = require("util");

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM;

    try {
        // get data from mongo
        const acspData: AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);

        res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
            editPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            correspondenceAddress: acspData?.applicantDetails?.correspondenceAddress
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
    const applicantDetails = acspData.applicantDetails || {};
    const acspDataService = new AcspDataService();
    if (util.isDeepStrictEqual(
        applicantDetails.correspondenceAddress, acspData.registeredOfficeAddress)) {
        applicantDetails.correspondenceAddressIsSameAsRegisteredOfficeAddress = true;
    } else {
        applicantDetails.correspondenceAddressIsSameAsRegisteredOfficeAddress =
          false;
    }
    acspData.applicantDetails = applicantDetails;
    //  save data to mongodb
    await acspDataService.saveAcspData(session, acspData);

    res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_EMAIL, lang));
};
