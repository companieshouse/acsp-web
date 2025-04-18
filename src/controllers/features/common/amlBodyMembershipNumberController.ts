import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_BODY_DETAILS_CONFIRM, AML_MEMBERSHIP_NUMBER, LIMITED_SELECT_AML_SUPERVISOR, SOLE_TRADER_SELECT_AML_SUPERVISOR, UNINCORPORATED_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { formatValidationError, resolveErrorMessage, getPageProperties } from "../../../validation/validation";
import { validationResult } from "express-validator";
import logger from "../../../utils/logger";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AmlSupervisoryBodyService } from "../../../services/amlSupervisoryBody/amlBodyService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspDataService } from "../../../services/acspDataService";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";

const amlSupervisoryBody = new AmlSupervisoryBodyService();

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl: string = BASE_URL + AML_MEMBERSHIP_NUMBER;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);
        const acspType: string = acspData?.typeOfBusiness!;
        const previousPage: string = getPreviousPage(acspType);
        const payload = createPayload(acspData.amlSupervisoryBodies || []);

        res.render(config.AML_MEMBERSHIP_NUMBER, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(previousPage, lang),
            currentUrl,
            amlSupervisoryBodies: acspData?.amlSupervisoryBodies,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            acspType: acspData?.typeOfBusiness,
            businessName: acspData?.businessName,
            payload,
            AMLSupervisoryBodies
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const acspType: string = acspData?.typeOfBusiness!;
    const previousPage: string = getPreviousPage(acspType);
    const currentUrl: string = BASE_URL + AML_MEMBERSHIP_NUMBER;

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const amlSupervisoryBodyStrings = acspData.amlSupervisoryBodies!.map(body => body.amlSupervisoryBody).filter((body): body is string => body !== undefined);
            errorListDisplay(errorList.array(), amlSupervisoryBodyStrings, lang, locales.i18nCh.resolveNamespacesKeys(lang));
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage: addLangToUrl(previousPage, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                amlSupervisoryBodies: acspData?.amlSupervisoryBodies,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                acspType: acspData?.typeOfBusiness,
                businessName: acspData?.businessName,
                payload: req.body,
                AMLSupervisoryBodies
            });
        } else {
            // update acspData
            amlSupervisoryBody.saveAmlSupervisoryBodies(req, acspData);
            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            const nextPageUrl = addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang);
            res.redirect(nextPageUrl);

        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};

const errorListDisplay = (errors: any[], amlSupervisoryBodies: string[], lang: string, i18n: any) => {
    return errors.map((element) => {
        const index = parseInt(element.param.substr("membershipNumber_".length)) - 1;
        const selectionKey = amlSupervisoryBodies[index];
        const selectionValue = i18n[selectionKey];
        element.msg = resolveErrorMessage(element.msg, lang);
        element.msg = element.msg + selectionValue;
        return element;
    });
};

const getPreviousPage = (ascpType: string): string => {
    switch (ascpType) {
    case "SOLE_TRADER":
        return BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    case "LC":
    case "CORPORATE_BODY":
    case "LLP":
        return BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    default:
        return BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;
    }
};

const createPayload = (amlSupervisoryBodies: AmlSupervisoryBody[]): { [key: string]: string | undefined } => {
    const payload: { [key: string]: string | undefined } = {};
    amlSupervisoryBodies.forEach((body, index) => {
        payload[`membershipNumber_${index + 1}`] = body.membershipId;
    });
    return payload;
};
