import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BUSINESS_ADDRESS, BUSINESS_NAME, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { Address } from "../../../model/Address";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { BusinessAddressService } from "../../../services/business-address/businessAddressService";
import { ACSPData } from "main/model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
        title: "Enter the business address",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY,
        businessName: acspData?.businessName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const businessName = session?.getExtraData(BUSINESS_NAME);

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
                title: "Enter the business address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: businessName
            });
        } else {
            const businessAddressService = new BusinessAddressService();
            businessAddressService.saveBusinessAddress(req);
            res.redirect(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
