import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ACSP_DETAILS_UPDATED, ADDRESS_LIST } from "../../../common/__utils/constants";
import * as config from "../../../config";
import {
    CANCEL_AN_UPDATE,
    UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LIST,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_CORRESPONDENCE_ADDRESS_MANUAL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const addressList = session.getExtraData(ADDRESS_LIST);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const previousPage:string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
        const currentUrl:string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST;

        res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE, lang) + "&cancel=serviceAddress",
            addresses: addressList,
            correspondenceAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl:string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST;
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const errorList = validationResult(req);
        const previousPage:string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                addresses: addressList,
                correspondenceAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectedPremise = req.body.correspondenceAddress;
            // Save selected address
            const correspondenceAddress: Address = addressList.filter((address) => address.premises === selectedPremise)[0];
            if (acspUpdatedFullProfile.type === "sole-trader") {
                acspUpdatedFullProfile.registeredOfficeAddress = correspondenceAddress;
            } else {
                acspUpdatedFullProfile.serviceAddress = correspondenceAddress;
            }
            session.setExtraData(ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);

            // Redirect to the address confirmation page
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        next(err);
    }
};
