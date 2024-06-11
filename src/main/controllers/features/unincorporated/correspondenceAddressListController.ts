import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ADDRESS_LIST, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST,
    UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import logger from "../../../../../lib/Logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";
import { SaveService } from "../../../services/saveService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const addressList = session.getExtraData(ADDRESS_LIST);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST;

    try {

        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
            title: locales.i18nCh.resolveNamespacesKeys(lang).correspondenceLookUpAddressListTitle,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
            addresses: addressList,
            businessName: acspData?.businessName,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        }
        );
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                title: locales.i18nCh.resolveNamespacesKeys(lang).correspondenceLookUpAddressListTitle,
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST,
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
                addresses: addressList,
                businessName: acspData?.businessName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectedPremise = req.body.correspondenceAddress;

            // Save selected address
            const correspondenceAddress: Address = addressList.filter((address) => address.propertyDetails === selectedPremise)[0];
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.saveCorrespondenceAddressFromList(req, correspondenceAddress, acspData);
            const saveService = new SaveService();
            await saveService.saveAcspData(session); ;

            // redirect to next page
            const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};
