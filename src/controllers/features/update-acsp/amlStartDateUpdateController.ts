import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, AML_MEMBERSHIP_NUMBER, UPDATE_AML_START_DATE, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATED, ADD_AML_BODY_UPDATE, NEW_AML_BODY } from "../../../common/__utils/constants";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang);
    const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_AML_START_DATE;

    try {
        res.render(config.UPDATE_AML_START_DATE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_AML_START_DATE;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang);
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
        const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_AML_START_DATE, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
            });
        } else {
            const amlStartDate = new Date(
                req.body["aml-start-day"],
                req.body["aml-start-month"] - 1,
                req.body["aml-start-day"]
            );

            if (updateBodyIndex !== undefined && updateBodyIndex >= 0) {
                acspUpdatedFullProfile.amlDetails[updateBodyIndex].supervisoryBody = newAMLBody.amlSupervisoryBody!;
                acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails = newAMLBody.membershipId!;
                // acspUpdatedFullProfile.amlDetails[updateBodyIndex].startDate = amlStartDate;
            } else {
                acspUpdatedFullProfile.amlDetails.push({
                    supervisoryBody: newAMLBody.amlSupervisoryBody!,
                    membershipDetails: newAMLBody.membershipId!
                    // startDate: amlStartDate
                });
            }
            session.deleteExtraData(NEW_AML_BODY);
            session.deleteExtraData(ADD_AML_BODY_UPDATE);

            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
        }
    } catch (err) {
        next(err);
    }
};
