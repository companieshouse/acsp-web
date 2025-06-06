import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../lib/nationalityList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { SOLE_TRADER_DATE_OF_BIRTH, BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData, Nationality } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(
            session,
      session.getExtraData(SUBMISSION_ID)!,
      res.locals.applicationId
        );
        saveDataInSession(req, USER_DATA, acspData);
        const payload = {
            nationality_input_0:
        acspData.applicantDetails?.nationality?.firstNationality,
            nationality_input_1:
        acspData.applicantDetails?.nationality?.secondNationality,
            nationality_input_2:
        acspData.applicantDetails?.nationality?.thirdNationality
        };

        res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            nationalityList: nationalityList,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            nationality: acspData?.applicantDetails?.nationality,
            payload

        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY;
    try {
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                nationalityList: nationalityList,
                payload: req.body,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                ...pageProperties

            });// determined from user not in banned list
        } else {
            const nationalityData: Nationality = {
                firstNationality: req.body.nationality_input_0,
                secondNationality: req.body.nationality_input_1,
                thirdNationality: req.body.nationality_input_2
            };

            if (acspData) {
                const applicantDetails = acspData.applicantDetails || {};
                applicantDetails.nationality = nationalityData;
                acspData.applicantDetails = applicantDetails;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
