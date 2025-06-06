import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { LocalesService } from "@companieshouse/ch-node-utils";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../utils/logger";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP;
    try {
        // get data from mongo
        const acspData: AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            postCode: acspData.registeredOfficeAddress?.postalCode,
            premise: acspData.registeredOfficeAddress?.premises
        };

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            businessName: acspData?.businessName,
            businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
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
        await addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData, true,
            UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST).then(async (nextPageUrl) => {
            try {
                // save data to mongodb
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
                res.redirect(nextPageUrl);
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
                next(err);
            }
        }).catch((error) => {
            const validationError = addressLookUpService.getErrorMessage(error, postcode);
            const pageProperties = getPageProperties(formatValidationError([validationError], lang));
            buildErrorResponse(req, res, locales, lang, acspData, pageProperties);
        });
    }
};

const buildErrorResponse = (req: Request, res: Response, locales: LocalesService, lang: string, acspData: AcspData, pageProperties: any) => {
    res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        pageProperties: pageProperties,
        payload: req.body,
        businessName: acspData?.businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });
};
