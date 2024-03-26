import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, BASE_URL } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { CorrespondenceAddressManualService } from "../../../services/correspondence-address/address-manual";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
        firstName: ACSPData?.firstName,
        lastName: ACSPData?.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: ACSPData?.firstName,
                lastName: ACSPData?.lastName
            });
        } else {
            CorrespondenceAddressManualService.saveCorrespondenceManualAddress(req, ACSPData);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
