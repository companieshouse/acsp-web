import { formatValidationError, getPageProperties } from "../../validation/validation";
import { addLangToUrl, getLocaleInfo } from "../../utils/localise";
import { Request, Response } from "express";
import * as config from "../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_SELECT_AML_SUPERVISOR, UPDATE_YOUR_ANSWERS } from "../../types/pageURL";
import { ADD_AML_BODY_UPDATE, NEW_AML_BODY } from "../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../model/AMLSupervisoryBodies";
import { ValidationError } from "express-validator";// Adjust the path as needed
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class AcspMembershipNumberService {
    /**
     * Handles a 400 Bad Request response by rendering the appropriate error page with validation error details.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param options - An object containing additional options for rendering the response.
     * @param options.lang - The language code for localization.
     * @param options.locales - The localization data for the application.
     * @param options.currentUrl - The current URL of the request.
     * @param options.newAMLBody - The new AML supervisory body data.
     * @param options.reqType - The type of the request being processed.
     * @param options.validationError - An array of validation errors to be displayed on the page.
     * @returns A promise that resolves when the response has been sent.
     */
    public responseStatus400 (req: Request, res: Response, options: { lang: string, locales: any, currentUrl: string, newAMLBody: AmlSupervisoryBody, reqType: string, validationError: ValidationError[] }): Promise<void> {
        return new Promise((resolve) => {
            const { lang, locales, currentUrl, newAMLBody, reqType, validationError } = options;
            const pageProperties = getPageProperties(formatValidationError(validationError, lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_SELECT_AML_SUPERVISOR, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                amlSupervisoryBodies: [newAMLBody],
                payload: req.body,
                AMLSupervisoryBodies,
                reqType,
                cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
            });
            resolve();
        });
    }

    public validateMembershipNumber (options: { acspUpdatedFullProfile: AcspFullProfile, newAmlNumber: string, newAMLBody: AmlSupervisoryBody, req: Request, res: Response, session: any, lang: string, locales: any, currentUrl: string, reqType: string, updateBodyIndex?: number }): void {
        const { acspUpdatedFullProfile, newAmlNumber, newAMLBody, req, res, session, lang, locales, currentUrl, reqType, updateBodyIndex } = options;

        if (acspUpdatedFullProfile.amlDetails.find(aml => aml.membershipDetails.toUpperCase() === newAmlNumber.toUpperCase() && aml.supervisoryBody === newAMLBody.amlSupervisoryBody) !== undefined) {
            const validationError : ValidationError[] = [{
                value: newAmlNumber,
                msg: "duplicatedAmlMembership",
                param: "membershipNumber_1",
                location: "body"
            }];
            this.responseStatus400(req, res, { lang, locales, currentUrl, newAMLBody, reqType, validationError });
        } else {
            newAMLBody.membershipId = req.body.membershipNumber_1;
            if (updateBodyIndex !== undefined && updateBodyIndex >= 0) {
                acspUpdatedFullProfile.amlDetails[updateBodyIndex].supervisoryBody = newAMLBody.amlSupervisoryBody!;
                acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails = newAMLBody.membershipId!;
            } else {
                acspUpdatedFullProfile.amlDetails.push({
                    supervisoryBody: newAMLBody.amlSupervisoryBody!,
                    membershipDetails: newAMLBody.membershipId!
                });
            }
            session.deleteExtraData(NEW_AML_BODY);
            session.deleteExtraData(ADD_AML_BODY_UPDATE);
            const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
            res.redirect(nextPageUrl);
        }
    }
}
