import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SELECT_AML_SUPERVISOR, BASE_URL, AML_MEMBERSHIP_NUMBER, LIMITED_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBodyService } from "../../../../src/services/amlSupervisoryBody/amlBodyService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL, lang);
    const currentUrl: string = BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        // collect selectedAMLs to render the page with saved data
        const selectedAMLSupervisoryBodies: string[] = [];
        const amlSupervisoryBody = new AmlSupervisoryBodyService();
        amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);

        res.render(config.SELECT_AML_SUPERVISOR, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            AMLSupervisoryBodies,
            acspType: acspData?.typeOfBusiness,
            businessName: acspData?.businessName,
            selectedAMLSupervisoryBodies
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    try {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                AMLSupervisoryBodies,
                acspType: acspData?.typeOfBusiness,
                businessName: acspData?.businessName,
                ...pageProperties
            });
        } else {
            // update acspData
            const amlSupervisoryBody = new AmlSupervisoryBodyService();
            amlSupervisoryBody.saveSelectedAML(req, acspData);

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
