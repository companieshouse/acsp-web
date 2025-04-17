import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ADDRESS_LIST } from "../../../common/__utils/constants";
import * as config from "../../../config";
import {
    UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LIST,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_CORRESPONDENCE_ADDRESS_MANUAL,
    UPDATE_YOUR_ANSWERS
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

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
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
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
            // Save selected address to temp variable
            const correspondenceAddress: Address = addressList.filter((address) => address.premises === req.body.correspondenceAddress)[0];
            session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, correspondenceAddress);

            // Redirect to the address confirmation page
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        next(err);
    }
};
