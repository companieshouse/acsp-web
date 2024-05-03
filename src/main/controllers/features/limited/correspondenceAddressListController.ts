import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ADDRESS_LIST, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { Address } from "../../../model/Address";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_LIST,
    LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const addressList = session.getExtraData(ADDRESS_LIST);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
        title: "Select your address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST,
        previousPage: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
        addresses: addressList,
        businessName: acspData?.businessName,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
    }
    );
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                title: "Select your address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST,
                previousPage: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
                addresses: addressList,
                businessName: acspData?.businessName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectedPremise = req.body.correspondenceAddress;

            // Save selected address to the session
            const correspondenceAddress: Address = addressList.filter((address) => address.propertyDetails === selectedPremise)[0];
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.saveCorrespondenceAddressFromList(req, correspondenceAddress);

            const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};