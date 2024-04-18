import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SELECT_AML_SUPERVISOR, LIMITED_SECTOR_YOU_WORK_IN, BASE_URL, AML_MEMBERSHIP_NUMBER, AML_REGISTRATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { AML_SUPERVISOR_SELECTED, USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const acspType = acspData?.typeofBusiness;
    res.render(config.SELECT_AML_SUPERVISOR, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
        title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
        ...getLocaleInfo(locales, lang),
        acspType: acspType,
        currentUrl: BASE_URL + LIMITED_SELECT_AML_SUPERVISOR
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
        const acspType = acspData?.typeofBusiness;
        const errorList = validationResult(req);
        console.log(req.body["AML-supervisory-bodies"]);
        // console.log(req.body);

        console.log(JSON.stringify(errorList));
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
                title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_SELECT_AML_SUPERVISOR,
                acspType: acspType,
                ...pageProperties
            });
        } else {
            const selectedAMLSupervisoryBodies = req.body["AML-supervisory-bodies"]
            console.log(selectedAMLSupervisoryBodies);
            if ( selectedAMLSupervisoryBodies instanceof Array ) {
                session.setExtraData(AML_SUPERVISOR_SELECTED,selectedAMLSupervisoryBodies);
            } else {
                const selectedAML = []
                selectedAML.push(selectedAMLSupervisoryBodies)
                session.setExtraData(AML_SUPERVISOR_SELECTED,selectedAML);
            }
           
            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
