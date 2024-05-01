import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { USER_DATA, UNINCORPORATED_CORRESPONDENCE_ADDRESS, ANSWER_DATA } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_NAME_REGISTERED_WITH_AML, LIMITED_SECTOR_YOU_WORK_IN, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_SELECT_AML_SUPERVISOR, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { ACSPData } from "../../../model/ACSPData";
import { validationResult } from "express-validator";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
        businessName: acspData?.businessName,
        businessAddress: acspData?.businessAddress,
        payload: req.body

    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const addressOption = req.body.addressSelectorRadio;
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
                ...pageProperties,
                businessName: acspData?.businessName,
                businessAddress: acspData?.businessAddress,
                payload: req.body
            });
        } else {
            session.setExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS, addressOption);
            if (addressOption === "CORRESPONDANCE_ADDRESS") {
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.correspondenceAddress = detailsAnswers.businessAddress;
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};
