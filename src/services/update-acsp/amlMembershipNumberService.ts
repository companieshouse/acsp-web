import { formatValidationError, getPageProperties } from "../../validation/validation";
import { addLangToUrl, getLocaleInfo } from "../../utils/localise";
import { Request, Response } from "express";
import * as config from "../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_ADD_AML_SUPERVISOR, UPDATE_YOUR_ANSWERS } from "../../types/pageURL";
import { ValidationError } from "express-validator";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "../../model/AcspFullProfile";
import { SupervisoryBodyMapping } from "../../model/SupervisoryBodyMapping";

export class AmlMembershipNumberService {
    /**
     * Handles a 400 Bad Request response by rendering the appropriate error page with validation error details.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param lang - The language code for localization.
     * @param locales - The localization data for the application.
     * @param currentUrl - The current URL of the request.
     * @param newAMLBody - The new AML supervisory body data.
     * @param validationError - An array of validation errors to be displayed on the page.
     * @returns A promise that resolves when the response has been sent.
     */
    public buildErrorResponse (req: Request, res: Response, lang: string, locales: any, currentUrl: string, newAMLBody: AmlSupervisoryBody, validationError: ValidationError[]): Promise<void> {
        return new Promise((resolve) => {
            const pageProperties = getPageProperties(formatValidationError(validationError, lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                amlSupervisoryBodies: [newAMLBody],
                payload: req.body,
                SupervisoryBodyMapping,
                cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
            });
            resolve();
        });
    }

    public validateUpdateBodyIndex (updateBodyIndex: number | undefined, acspUpdatedFullProfile: AcspFullProfile, newAMLBody: AmlSupervisoryBody): void {
        if (updateBodyIndex !== undefined && updateBodyIndex >= 0) {
            acspUpdatedFullProfile.amlDetails[updateBodyIndex].supervisoryBody = newAMLBody.amlSupervisoryBody!;
            acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails = newAMLBody.membershipId!;
            acspUpdatedFullProfile.amlDetails[updateBodyIndex].dateOfChange = newAMLBody.dateOfChange!;
        } else {
            acspUpdatedFullProfile.amlDetails.push({
                supervisoryBody: newAMLBody.amlSupervisoryBody!,
                membershipDetails: newAMLBody.membershipId!,
                dateOfChange: newAMLBody.dateOfChange!
            });
        }
    }
}
