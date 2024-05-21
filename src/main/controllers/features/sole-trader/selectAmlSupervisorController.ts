import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SELECT_AML_SUPERVISOR, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, AML_MEMBERSHIP_NUMBER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBodyService } from "../../../../main/services/amlSupervisoryBody/amlBodyService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.SELECT_AML_SUPERVISOR, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang),
        title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        acspType: acspData?.typeOfBusiness,
        AMLSupervisoryBodies
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;

        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang),
                title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR,
                AMLSupervisoryBodies,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });
        } else {
            const amlSupervisoryBody = new AmlSupervisoryBodyService();
            amlSupervisoryBody.saveSelectedAML(req, acspData);
            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (error) {
        next(error);
    }
};
