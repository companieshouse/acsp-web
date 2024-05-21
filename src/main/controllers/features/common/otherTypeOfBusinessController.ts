import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ANSWER_DATA, USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { TypeOfBusiness } from "../../../model/TypeOfBusiness";
import { Answers } from "../../../model/Answers";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.OTHER_TYPE_OF_BUSINESS, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        title: "What other type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + OTHER_TYPE_OF_BUSINESS
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.otherTypeOfBusinessRadio;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.OTHER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: "What other type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + OTHER_TYPE_OF_BUSINESS,
                ...pageProperties
            });
        } else {
            const session: Session = req.session as any as Session;
            // eslint-disable-next-line camelcase
            const email = session?.data?.signin_info?.user_profile?.email!;
            const acspData: ACSPData = {
                id: email,
                typeOfBusiness: selectedOption
            };
            const answersArray: Answers = {
                typeOfBusiness: TypeOfBusiness[selectedOption as keyof typeof TypeOfBusiness]
            };
            saveDataInSession(req, ANSWER_DATA, answersArray);
            saveDataInSession(req, USER_DATA, acspData);
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang)); // Redirect to Unincorporated journey] Which name is registered with your Anti-Money Laundering (AML) supervisory body?
        }
    } catch (error) {
        next(error);
    }
};
