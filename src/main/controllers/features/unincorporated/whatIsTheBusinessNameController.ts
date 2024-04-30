import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, BASE_URL, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHAT_IS_YOUR_NAME, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, UNINCORPORATED_AML_SELECTED_OPTION, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ACSPData } from "../../../model/ACSPData";
import { Answers } from "../../../model/Answers";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const unincorporatedAmlSelectedOption = session?.getExtraData(UNINCORPORATED_AML_SELECTED_OPTION)!;
    let previousPage;
    // Check if the selected option is "NAME_OF_THE_BUSINESS
    if (unincorporatedAmlSelectedOption === "NAME_OF_THE_BUSINESS") {
        previousPage = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
    }
    res.render(config.WHAT_IS_THE_BUSINESS_NAME, {
        previousPage: addLangToUrl(previousPage, lang),
        title: "What is the name of the business?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const unincorporatedAmlSelectedOption = session?.getExtraData(UNINCORPORATED_AML_SELECTED_OPTION)!;
        let previousPage;
        // Check if the selected option is "NAME_OF_THE_BUSINESS
        if (unincorporatedAmlSelectedOption === "NAME_OF_THE_BUSINESS") {
            previousPage = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
        } else {
            previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
        }
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(previousPage, lang),
                title: "What is the name of the business?",
                payload: req.body,
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME,
                ...pageProperties
            });
        } else {
            const unincorporatedBusinessName = req.body.whatIsTheBusinessName;
            const acspData: ACSPData = session.getExtraData(USER_DATA)!;
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.businessName = unincorporatedBusinessName;
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            if (acspData) {
                acspData.businessName = unincorporatedBusinessName;
                saveDataInSession(req, USER_DATA, acspData);
            }

            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang));
        }
    } catch (error) {
        next(error);
    }
};
