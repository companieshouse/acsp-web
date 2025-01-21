import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, BASE_URL, LIMITED_SECTOR_YOU_WORK_IN } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

const util = require("util");

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM;

    try {
        // get data from mongo
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);

        res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
            previousPage,
            editPage: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            correspondenceAddress: acspData?.applicantDetails?.correspondenceAddress
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
    res.redirect(addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang));
};
