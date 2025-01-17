import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import {
    SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM,
    BASE_URL, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS
} from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ADDRESS_LIST, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AddressLookUpService } from "../../../../src/services/address/addressLookUp";
import logger from "../../../utils/logger";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";
import { http401ErrorHandler } from "../../errorController";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST;
    const session: Session = req.session as any as Session;
    const addressList = session.getExtraData(ADDRESS_LIST);

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            addresses: addressList,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            correspondenceAddressManualLink: addLangToUrl(
                BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
                lang
            )
        });
    } catch (err: any) {
        const httpStatusCode = err.httpStatusCode;
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        if (httpStatusCode === 401) {
            http401ErrorHandler(err, req, res, next);
        } else {
            const error = new ErrorService();
            error.renderErrorPage(res, locales, lang, currentUrl);
        }
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST;
    try {
        const errorList = validationResult(req);
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang);
        const session: Session = req.session as any as Session;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                addresses: addressList,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectPremise = req.body.correspondenceAddress;

            // Save selected address to the session
            const correspondenceAddress: Address = addressList.filter((address) => address.premises === selectPremise)[0];
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.saveCorrespondenceAddressFromList(req, correspondenceAddress, acspData);

            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);

        }
    } catch (err: any) {
        const httpStatusCode = err.httpStatusCode;
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        if (httpStatusCode === 401) {
            http401ErrorHandler(err, req, res, next);
        } else {
            const error = new ErrorService();
            error.renderErrorPage(res, locales, lang, currentUrl);
        }
    }
};
