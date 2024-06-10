import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BusinessAddressService } from "../../../services/business-address/businessAddressService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const businessAddressService = new BusinessAddressService();
        const payload = businessAddressService.getBusinessManualAddress(acspData);

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
            title: locales.i18nCh.resolveNamespacesKeys(lang).businessAddressManualTitle,
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
            currentUrl,
            businessName: acspData?.businessName,
            payload: payload
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

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
                title: locales.i18nCh.resolveNamespacesKeys(lang).businessAddressManualTitle,
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspData?.businessName
            });
        } else {
            const businessAddressService = new BusinessAddressService();
            businessAddressService.saveBusinessAddress(req, acspData);

            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang));
        }
    } catch (error) {
        next(error);
    }
};
