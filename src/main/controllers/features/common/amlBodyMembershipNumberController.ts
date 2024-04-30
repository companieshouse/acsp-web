import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_BODY_DETAILS_CONFIRM, AML_MEMBERSHIP_NUMBER, LIMITED_SELECT_AML_SUPERVISOR, SOLE_TRADER_SELECT_AML_SUPERVISOR, UNINCORPORATED_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "node-mocks-http";
import { ACSPData } from "../../../model/ACSPData";
import { AML_SUPERVISOR_SELECTED, USER_DATA } from "../../../common/__utils/constants";
import { formatValidationError, resolveErrorMessage, getPageProperties } from "../../../validation/validation";
import { validationResult } from "express-validator";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const acspType: string = acspData?.typeOfBusiness!;
    const selectedAMLSupervisoryBodies: string[] = session?.getExtraData(AML_SUPERVISOR_SELECTED);

    var previousPage: string = "";
    if (acspType === "SOLE_TRADER") {
        previousPage = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    } else if (acspType === "LIMITED_COMPANY" || acspType === "LIMITED_PARTNERSHIP" || acspType === "LIMITED_LIABILITY_PARTNERSHIP") {
        previousPage = BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;
    }
    res.render(config.AML_MEMBERSHIP_NUMBER, {
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(previousPage, lang),
        currentUrl: BASE_URL + AML_MEMBERSHIP_NUMBER,
        selectedAMLSupervisoryBodies

    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const selectedAMLSupervisoryBodies: string[] = session?.getExtraData(AML_SUPERVISOR_SELECTED);
    const acspType: string = acspData?.typeOfBusiness!;

    var previousPage: string = "";
    if (acspType === "SOLE_TRADER") {
        previousPage = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    } else if (acspType === "LIMITED_COMPANY" || acspType === "LIMITED_PARTNERSHIP" || acspType === "LIMITED_LIABILITY_PARTNERSHIP") {
        previousPage = BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;
    }

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            errorListDisplay(errorList.array(), selectedAMLSupervisoryBodies, lang)
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage: addLangToUrl(previousPage, lang),
                title: "What is the Anti-Money Laundering (AML) membership number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + AML_MEMBERSHIP_NUMBER,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                selectedAMLSupervisoryBodies
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};



const errorListDisplay = (errors: any[], selectedAMLSupervisoryBodies: string[], lang: string) => {
    return errors.forEach((element, index) => {
        const selection = selectedAMLSupervisoryBodies[index];
        element.msg = resolveErrorMessage(element.msg, lang);
        element.msg = element.msg + selection;
        return element

    });
};