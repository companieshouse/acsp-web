import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SELECT_AML_SUPERVISOR, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, AML_MEMBERSHIP_NUMBER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBodyService } from "../../../../main/services/amlSupervisoryBody/amlBodyService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    // const acspData: AcspData = session?.getExtraData(USER_DATA)!;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        // collect selectedAMLs to render the page with saved data
        const selectedAMLSupervisoryBodies: string[] = [];
        const amlSupervisoryBody = new AmlSupervisoryBodyService();
        amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);

        res.render(config.SELECT_AML_SUPERVISOR, {
            previousPage,
            title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            acspType: acspData?.typeOfBusiness,
            AMLSupervisoryBodies,
            selectedAMLSupervisoryBodies
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
        const currentUrl: string = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;

        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage,
                title: "Which Anti-Money Laundering (AML) supervisory bodies are you registered with?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                AMLSupervisoryBodies,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });
        } else {
            const amlSupervisoryBody = new AmlSupervisoryBodyService();
            amlSupervisoryBody.saveSelectedAML(req, acspData);
            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (error) {
        next(error);
    }
};
