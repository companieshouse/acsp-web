import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_SELECT_AML_SUPERVISOR, BASE_URL, AML_MEMBERSHIP_NUMBER, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, UNINCORPORATED_CORRESPONDENCE_ADDRESS } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { AmlSupervisoryBodyService } from "../../../../main/services/amlSupervisoryBody/amlBodyService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const correspondenceAddress: string = session?.getExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS)!;
    var previousPage: string = "";
    if (correspondenceAddress === "CORRESPONDANCE_ADDRESS") {
        previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM;
    }
    res.render(config.SELECT_AML_SUPERVISOR, {
        previousPage: addLangToUrl(previousPage, lang),
        title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
        ...getLocaleInfo(locales, lang),
        acspType: acspData?.typeOfBusiness,
        currentUrl: BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;

        const correspondenceAddress: string = session?.getExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS)!;
        var previousPage: string = "";
        if (correspondenceAddress === "CORRESPONDANCE_ADDRESS") {
            previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
        } else {
            previousPage = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM;
        }
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage: addLangToUrl(previousPage, lang),
                title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });
        } else {
            const AmlSupervisoryBody = new AmlSupervisoryBodyService();
            AmlSupervisoryBody.saveSelectedAML(session, req);
            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (error) {
        next(error);
    }
};
