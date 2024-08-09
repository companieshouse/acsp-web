import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
    UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { LocalesService } from "@companieshouse/ch-node-utils";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP;

    try {
    // get data from mongo
        const acspData:AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            postCode: acspData.applicantDetails?.correspondenceAddress?.postcode,
            premise:
        acspData.applicantDetails?.correspondenceAddress?.propertyDetails
        };

        res.render(config.AUTO_LOOKUP_ADDRESS, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            businessName: acspData?.businessName,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
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
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        buildErrorResponse(req, res, next, locales, lang, acspData, pageProperties);
    } else {
        const postcode = req.body.postCode;
        const inputPremise = req.body.premise;
        const addressLookUpService = new AddressLookUpService();
        await addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData, false,
            UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST).then(async (nextPageUrl) => {
            try {
                // save data to mongodb
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
                res.redirect(nextPageUrl);
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP);
            }
        }).catch(() => {
            const validationError : ValidationError[] = [{
                value: postcode,
                msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                param: "postCode",
                location: "body"
            }];
            const pageProperties = getPageProperties(formatValidationError(validationError, lang));
            buildErrorResponse(req, res, next, locales, lang, acspData, pageProperties);
        });
    }
};

const buildErrorResponse = (req: Request, res: Response, next: NextFunction, locales: LocalesService, lang: string, acspData: AcspData, pageProperties: any) => {
    res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang),
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP,
        pageProperties: pageProperties,
        payload: req.body,
        businessName: acspData?.businessName,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
    });
};
