import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ADDRESS_LIST, USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_LIST,
    LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const addressList = session.getExtraData(ADDRESS_LIST);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage:string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
    const currentUrl:string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            addresses: addressList,
            businessName: acspData?.businessName,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl:string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST;
    try {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const errorList = validationResult(req);
        const previousPage:string = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                addresses: addressList,
                businessName: acspData?.businessName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectedPremise = req.body.correspondenceAddress;

            // Save selected address
            const correspondenceAddress: Address = addressList.filter((address) => address.propertyDetails === selectedPremise)[0];
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.saveCorrespondenceAddressFromList(req, correspondenceAddress, acspData);
            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

            const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
