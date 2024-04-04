import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { CorrespondenceAddressManualService } from "../../../services/correspondence-address/correspondence-address-manual";
import { UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, BASE_URL } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, {
        title: "Enter the correspondence address",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
        currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL,
        businessName: acspData?.businessName
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
            res.status(400).render(config.UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
                title: "Enter the correspondence address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspData?.businessName
            });
        } else {
            // Save the correspondence address to session
            const addressManualservice = new CorrespondenceAddressManualService();
            addressManualservice.saveCorrespondenceManualAddress(req);
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
