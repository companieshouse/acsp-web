import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { LocalesService } from "@companieshouse/ch-node-utils";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        title: "What is your business address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        businessName: acspData?.businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!; // Needs to be removed once save and continue refactoring is done
    const acspData1 : AcspData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            buildErrorResponse(req, res, locales, lang, acspData, pageProperties);
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData1,
                UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST).then((nextPageUrl) => {
                res.redirect(nextPageUrl);
            }).catch(() => {
                const validationError : ValidationError[] = [{
                    value: postcode,
                    msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                    param: "postCode",
                    location: "body"
                }];
                const pageProperties = getPageProperties(formatValidationError(validationError, lang));
                buildErrorResponse(req, res, locales, lang, acspData, pageProperties);
            });
        }
    } catch (error) {
        next(error);
    }

};

const buildErrorResponse = (req: Request, res: Response, locales: LocalesService, lang: string, acspData: ACSPData, pageProperties: any) => {
    res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        title: "What is your business address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        pageProperties: pageProperties,
        payload: req.body,
        businessName: acspData?.businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });
};
