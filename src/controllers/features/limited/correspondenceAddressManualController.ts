import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { CorrespondenceAddressManualService } from "../../../services/correspondence-address/correspondence-address-manual";
import { LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspDataService } from "../../../services/acspDataService";
import countryList from "../../../../lib/countryListWithUKCountries";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        const addressManualservice = new CorrespondenceAddressManualService();
        const payload = addressManualservice.getCorrespondenceManualAddress(acspData);

        res.render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            countryList: countryList,
            businessName: acspData?.businessName,
            typeOfBusiness: acspData?.typeOfBusiness,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : AcspData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL;
    const locales = getLocalesService();

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                countryList: countryList,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspData?.businessName,
                typeOfBusiness: acspData?.typeOfBusiness
            });
        } else {
            // update acspData
            const addressManualservice = new CorrespondenceAddressManualService();
            addressManualservice.saveCorrespondenceManualAddress(req, acspData);

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            res.redirect(addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
