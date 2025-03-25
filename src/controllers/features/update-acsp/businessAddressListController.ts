import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ADDRESS_LIST } from "../../../common/__utils/constants";
import * as config from "../../../config";
import {
    UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_LIST,
    UPDATE_BUSINESS_ADDRESS_LOOKUP, UPDATE_BUSINESS_ADDRESS_MANUAL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { formatValidationError, getPageProperties } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl:string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST;
        const addressList = session.getExtraData(ADDRESS_LIST);
        const previousPage:string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP, lang);

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LIST, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            addresses: addressList,
            businessAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl:string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST;
        const session: Session = req.session as any as Session;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const errorList = validationResult(req);
        const previousPage:string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP, lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LIST, {
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                addresses: addressList,
                businessAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectedPremise = req.body.businessAddress;
            // Save selected address
            const businessAddress: Address = addressList.filter((address) => address.premises === selectedPremise)[0];
            session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, businessAddress);

            // Redirect to the address confirmation page
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        next(err);
    }
};
