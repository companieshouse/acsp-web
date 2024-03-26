
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { getAddressFromPostcode } from "../../../services/postcode-lookup-service";
import { getCountryFromKey } from "../../../utils/web";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import CorrespondenceAddressAutoLookService from "../../../services/correspondence-address/address-autolookup";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
        title: "What is your correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                title: "What is your correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
            });
        } else {
            const postcode = req.body.postCode;
            const correspondencePremise = req.body.premise;
            getAddressFromPostcode(postcode).then((ukAddresses) => {
                if (correspondencePremise !== "" && ukAddresses.find((address) => address.premise === correspondencePremise)) {

                    CorrespondenceAddressAutoLookService.saveCorrespondenceAddressToSession(session, req, ukAddresses, correspondencePremise);
                    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang));

                } else {

                    CorrespondenceAddressAutoLookService.saveAddressListToSession(session, req, ukAddresses);
                    const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, lang);
                    res.redirect(nextPageUrl);

                }

            }).catch(() => {
                const validationError : ValidationError[] = [{
                    value: postcode,
                    msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                    param: "postcode",
                    location: "body"
                }];
                const pageProperties = getPageProperties(formatValidationError(validationError, lang));
                res.status(400).render(config.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, {
                    previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                    title: "What is your correspondence address?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
                    pageProperties: pageProperties,
                    payload: req.body,
                    firstName: acspData?.firstName,
                    lastName: acspData?.lastName,
                    correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
                });
            });
        }
    } catch (error) {
        next(error);
    }

};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
