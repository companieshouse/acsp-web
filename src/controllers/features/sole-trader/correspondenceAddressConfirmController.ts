import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

const util = require("util");

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM;

    try {
        // get data from mongodb
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);

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
        next(err);
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
    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL, lang));
};
