import { NextFunction, Request, Response } from "express";
import { AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_ADD_AML_SUPERVISOR, UPDATE_AML_MEMBERSHIP_NUMBER, UPDATE_DATE_OF_THE_CHANGE, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { ADD_AML_BODY_UPDATE, NEW_AML_BODY, ACSP_DETAILS_UPDATED, ACSP_UPDATE_PREVIOUS_PAGE_URL, AML_REMOVED_BODY_DETAILS } from "../../../common/__utils/constants";
import { resolveErrorMessage } from "../../../validation/validation";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ValidationError, validationResult } from "express-validator";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AmlMembershipNumberService } from "../../../services/update-acsp/amlMembershipNumberService";
import { SupervisoryBodyMapping } from "../../../model/SupervisoryBodyMapping";
import { trimAndLowercaseString } from "../../../services/common";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER;
        const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
        const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;

        let payload;
        if (newAMLBody && newAMLBody.membershipId) {
            payload = { membershipNumber_1: newAMLBody.membershipId };
        } else if (updateBodyIndex !== undefined) {
            payload = { membershipNumber_1: acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails };
        }

        res.render(config.AML_MEMBERSHIP_NUMBER, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
            currentUrl,
            payload,
            amlSupervisoryBodies: [newAMLBody],
            SupervisoryBodyMapping,
            cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER;
        const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY) || {};
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const AmlMembershipNumberServiceInstance = new AmlMembershipNumberService();
        const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
        if (!newAMLBody.amlSupervisoryBody && updateBodyIndex && updateBodyIndex > -1) {
            newAMLBody.amlSupervisoryBody = acspUpdatedFullProfile.amlDetails[updateBodyIndex].supervisoryBody;
            newAMLBody.membershipId = acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails;
        }
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const amlSupervisoryBodyString = newAMLBody.amlSupervisoryBody!;
            errorListDisplay(errorList.array(), amlSupervisoryBodyString, lang, locales);
            AmlMembershipNumberServiceInstance.buildErrorResponse(req, res, lang, locales, currentUrl, newAMLBody, errorList.array());
        } else {
            const newAmlNumber = req.body.membershipNumber_1;
            const isDuplicate = acspUpdatedFullProfile.amlDetails.some((aml, index) =>
                trimAndLowercaseString(aml.membershipDetails) === trimAndLowercaseString(newAmlNumber) &&
                trimAndLowercaseString(aml.supervisoryBody) === trimAndLowercaseString(newAMLBody.amlSupervisoryBody) &&
                (updateBodyIndex === undefined || index !== updateBodyIndex)
            );

            const removedAMLDetails: AmlSupervisoryBody[] = session.getExtraData(AML_REMOVED_BODY_DETAILS) || [];
            const isReaddingRemovedAML = removedAMLDetails.some(
                (removedAML) =>
                    trimAndLowercaseString(removedAML.amlSupervisoryBody) === trimAndLowercaseString(newAMLBody.amlSupervisoryBody) &&
                    trimAndLowercaseString(removedAML.membershipId) === trimAndLowercaseString(newAmlNumber)
            );

            if (isDuplicate || isReaddingRemovedAML) {
                const validationError: ValidationError[] = [{
                    value: newAmlNumber,
                    msg: "duplicatedAmlMembership",
                    param: "membershipNumber_1",
                    location: "body"
                }];
                AmlMembershipNumberServiceInstance.buildErrorResponse(req, res, lang, locales, currentUrl, newAMLBody, validationError);
                return;
            }

            // Save new AML membership number to session
            newAMLBody.membershipId = req.body.membershipNumber_1;
            session.setExtraData(NEW_AML_BODY, newAMLBody);
            session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_AML_MEMBERSHIP_NUMBER);

            const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang);
            res.redirect(nextPageUrl);
        }
    } catch (err) {
        next(err);
    }
};

const errorListDisplay = (errors: any[], amlSupervisoryBody: string, lang: string, locales: any) => {
    const i18n = getLocaleInfo(locales, lang).i18n;
    const amlBodyNameAcronym = SupervisoryBodyMapping[amlSupervisoryBody as keyof typeof SupervisoryBodyMapping];
    const selectionValue = i18n[amlBodyNameAcronym];
    return errors.map((element) => {
        element.msg = resolveErrorMessage(element.msg, lang);
        element.msg = element.msg + selectionValue;
        return element;
    });
};
