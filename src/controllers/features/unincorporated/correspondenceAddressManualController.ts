import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { CorrespondenceAddressManualService } from "../../../services/correspondence-address/correspondence-address-manual";
import { UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspDataService } from "../../../services/acspDataService";
import countryList from "../../../../lib/countryListWithUKCountries";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        const addressManualservice = new CorrespondenceAddressManualService();
        const payload = addressManualservice.getCorrespondenceManualAddress(acspData?.applicantDetails?.correspondenceAddress);

        res.render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
            countryList: countryList,
            currentUrl,
            businessName: acspData?.businessName,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : AcspData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                countryList: countryList,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspData?.businessName
            });
        } else {
            // Update acspData
            const addressManualservice = new CorrespondenceAddressManualService();
            addressManualservice.saveCorrespondenceManualAddress(req, acspData);

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            // redirect to confirm address page
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
