import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { LocalesService } from "@companieshouse/ch-node-utils";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { SaveService } from "../../../services/saveService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP;
    try {
        // get data from mongo
        const acspData: AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            postCode: acspData.businessAddress?.postcode,
            premise: acspData.businessAddress?.propertyDetails
        };

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
            title: locales.i18nCh.resolveNamespacesKeys(lang).businessLookUpAddressTitle,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            businessName: acspData?.businessName,
            businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            buildErrorResponse(req, res, locales, lang, acspData, pageProperties);
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            const addressLookUpService = new AddressLookUpService();
            await addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData, true,
                UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST).then(async (nextPageUrl) => {
                // save data to mongodb
                const saveService = new SaveService();
                await saveService.saveAcspData(session);
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

const buildErrorResponse = (req: Request, res: Response, locales: LocalesService, lang: string, acspData: AcspData, pageProperties: any) => {
    res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        title: locales.i18nCh.resolveNamespacesKeys(lang).businessLookUpAddressTitle,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        pageProperties: pageProperties,
        payload: req.body,
        businessName: acspData?.businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });
};
