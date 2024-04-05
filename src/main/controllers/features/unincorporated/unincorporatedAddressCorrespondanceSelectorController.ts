import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { USER_DATA } from "../../../common/__utils/constants";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL, TYPE_OF_BUSINESS, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_SELECT_AML_SUPERVISOR, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, UNINCORPORATED_WHAT_IS_YOUR_ROLE } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { ACSPData } from "main/model/ACSPData";
import { validationResult } from "express-validator";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.UNINCORPORATED_ADDRESS_CORRESPONDANCE_SELECTOR, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, lang),
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
        businessName: acspData?.businessName,
        businessAddress: acspData?.businessAddress,
        correspondenceAddress: acspData?.address,
        payload: req.body

    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const addressOption = req.body.addressSelectorRadio;
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_ADDRESS_CORRESPONDANCE_SELECTOR, {
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
                ...pageProperties,
                businessName: acspData?.businessName,
                businessAddress: acspData?.businessAddress,
                correspondenceAddress: acspData?.address,
                payload: req.body
            });
        } else {

            switch (addressOption) {
            case "CORRESPONDANCE_ADDRESS":
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR, lang));
                break;
            case "DIFFERENT_ADDRESS":
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang));
                break;

            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
