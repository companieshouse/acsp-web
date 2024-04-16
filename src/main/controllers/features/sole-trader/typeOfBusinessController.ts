import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, SOLE_TRADER_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { TypeOfBusinessService } from "../../../services/typeOfBusinessService";
import { SUBMISSION_ID, TRANSACTION_CREATE_ERROR, USER_DATA } from "../../../common/__utils/constants";
import logger from "../../../../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ACSPData } from "../../../model/ACSPData";
import { FEATURE_FLAG_DISABLE_LIMITED_JOURNEY, FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY } from "../../../utils/properties";
import { isActiveFeature } from "../../../utils/feature.flag";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const typeOfBusinessService = new TypeOfBusinessService();
    const session: Session = req.session as any as Session;
    const existingTransactionId = session?.getExtraData(SUBMISSION_ID);

    // create transaction record
    try {
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            await typeOfBusinessService.createTransaction(req, res, "").then((transactionId) => {
                // get transaction record data
                saveDataInSession(req, SUBMISSION_ID, transactionId);
            });
        }
    } catch (err) {
        logger.error(TRANSACTION_CREATE_ERROR);
        return Promise.reject(err);
    }
    res.render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
        previousPage: addLangToUrl(BASE_URL, lang),
        title: "What type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + TYPE_OF_BUSINESS,
        typeOfBusiness: req.query.typeOfBusiness,
        FEATURE_FLAG_DISABLE_LIMITED_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_LIMITED_JOURNEY),
        FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY)
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.typeOfBusinessRadio;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(BASE_URL, lang),
                title: "What type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + TYPE_OF_BUSINESS,
                ...pageProperties
            });
        } else {
            const session: Session = req.session as any as Session;
            // eslint-disable-next-line camelcase
            const email = session?.data?.signin_info?.user_profile?.email!;
            if (selectedOption !== "OTHER") {
                const acspData : ACSPData = {
                    id: email,
                    typeofBusiness: selectedOption
                };
                saveDataInSession(req, USER_DATA, acspData);
            }

            switch (selectedOption) {
            case "LIMITED_COMPANY":
            case "LIMITED_PARTNERSHIP":
            case "LIMITED_LIABILITY_PARTNERSHIP":
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
                break;
            case "PARTNERSHIP":
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
                break;
            case "SOLE_TRADER":
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang));
                break;
            case "OTHER":
                res.redirect(addLangToUrl(BASE_URL + OTHER_TYPE_OF_BUSINESS, lang));
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
