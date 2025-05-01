import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS, AML_MEMBERSHIP_NUMBER, REMOVE_AML_SUPERVISOR } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { getPreviousPageUrlDateOfChange, updateWithTheEffectiveDateAmendment } from "../../../services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ACSP_UPDATE_PREVIOUS_PAGE_URL, AML_REMOVAL_BODY, AML_REMOVAL_INDEX, AML_REMOVED_BODY_DETAILS } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + getPreviousPageUrlDateOfChange(req), lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

        // Save the AML removal index and body to the session to send to remove aml url
        session.setExtraData(AML_REMOVAL_INDEX, req.query.amlindex);
        session.setExtraData(AML_REMOVAL_BODY, req.query.amlbody);

        const isAmlSupervisionStart = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        const isAmlSupervisionEnd = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);

        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            cancelTheUpdateUrl,
            currentUrl,
            isAmlSupervisionStart,
            isAmlSupervisionEnd
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
        const session: Session = req.session as any as Session;
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;
        const amlRemovalIndex = session.getExtraData(AML_REMOVAL_INDEX);
        const amlRemovalBody = session.getExtraData(AML_REMOVAL_BODY);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + getPreviousPageUrlDateOfChange(req), lang);
        const isAmlSupervisionStart = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        const isAmlSupervisionEnd = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_DATE_OF_THE_CHANGE, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                cancelTheUpdateUrl,
                pageProperties: pageProperties,
                payload: req.body,
                isAmlSupervisionStart,
                isAmlSupervisionEnd
            });
        } else {
            const dateOfChange = new Date(
                req.body["change-year"],
                req.body["change-month"] - 1,
                req.body["change-day"]);

            if (amlRemovalIndex && amlRemovalBody) {
                // Store the dateOfChange in REMOVED_AML_DETAILS as new array or append to existing array
                const removedAMLDetails: AmlSupervisoryBody[] = (session.getExtraData(AML_REMOVED_BODY_DETAILS) ?? []);
                const updatedRemovedAMLDetails = [
                    ...removedAMLDetails,
                    {
                        amlSupervisoryBody: amlRemovalBody,
                        membershipId: amlRemovalIndex,
                        dateOfChange: dateOfChange.toISOString()
                    }
                ];
                session.setExtraData(AML_REMOVED_BODY_DETAILS, updatedRemovedAMLDetails);
                res.redirect(addLangToUrl(`${UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR}?amlindex=${amlRemovalIndex}&amlbody=${amlRemovalBody}&return=your-updates`, lang));
            } else {
                updateWithTheEffectiveDateAmendment(req, dateOfChange.toISOString());
                res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
            }
        }
    } catch (err) {
        next(err);
    }
};
