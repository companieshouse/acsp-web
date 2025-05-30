import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS, AML_MEMBERSHIP_NUMBER, REMOVE_AML_SUPERVISOR, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_WHERE_DO_YOU_LIVE, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_CONFIRM } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { getDateOfChangeFromSession, getPreviousPageUrlDateOfChange, updateWithTheEffectiveDateAmendment } from "../../../services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { Address, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATED, NEW_AML_BODY, ADD_AML_BODY_UPDATE, AML_REMOVAL_BODY, AML_REMOVAL_INDEX, AML_REMOVED_BODY_DETAILS, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { soleTraderNameDetails } from "model/SoleTraderNameDetails";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + getPreviousPageUrlDateOfChange(req), lang);
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const updateInProgress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        let payload = {};
        let dateOfChange: any = null;

        if (updateInProgress) {
            dateOfChange = getDateOfChangeFromSession(previousPage, session);
        }

        if (!session.getExtraData(NEW_AML_BODY) && previousPage.includes(AML_MEMBERSHIP_NUMBER)) {
            const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
            if (session.getExtraData(ADD_AML_BODY_UPDATE) === undefined) {
                session.setExtraData(ADD_AML_BODY_UPDATE, acspUpdatedFullProfile.amlDetails.length - 1);
            }
            const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
            if (updateBodyIndex !== undefined && session.getExtraData(NEW_AML_BODY) === undefined) {
                const amlBody: AmlSupervisoryBody = {};
                amlBody.amlSupervisoryBody = acspUpdatedFullProfile.amlDetails[updateBodyIndex].supervisoryBody;
                amlBody.membershipId = acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails;
                session.setExtraData(NEW_AML_BODY, amlBody);
            }
        } else if (!updateInProgress) {
            if (previousPage.includes(UPDATE_ACSP_WHAT_IS_YOUR_NAME)) {
                const updateInProgressSoleTraderName: soleTraderNameDetails = {
                    forename: acspUpdatedFullProfile.soleTraderDetails?.forename,
                    otherForenames: acspUpdatedFullProfile.soleTraderDetails?.otherForenames,
                    surname: acspUpdatedFullProfile.soleTraderDetails?.surname
                };
                session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressSoleTraderName);
                dateOfChange = session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME);
            } else if (previousPage.includes(UPDATE_WHAT_IS_THE_BUSINESS_NAME)) {
                session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, acspUpdatedFullProfile.name);
                dateOfChange = session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS);
            } else if (previousPage.includes(UPDATE_WHERE_DO_YOU_LIVE)) {
                session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, acspUpdatedFullProfile.soleTraderDetails?.usualResidentialCountry);
                dateOfChange = session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE);
            } else if (previousPage.includes(UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM)) {
                const updateInProgressCorrespondenceAddress: Address = {
                    premises: acspUpdatedFullProfile.serviceAddress?.premises,
                    addressLine1: acspUpdatedFullProfile.serviceAddress?.addressLine1,
                    addressLine2: acspUpdatedFullProfile.serviceAddress?.addressLine2,
                    locality: acspUpdatedFullProfile.serviceAddress?.locality,
                    region: acspUpdatedFullProfile.serviceAddress?.region,
                    country: acspUpdatedFullProfile.serviceAddress?.country,
                    postalCode: acspUpdatedFullProfile.serviceAddress?.postalCode
                };
                session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressCorrespondenceAddress);
                dateOfChange = session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
            } else if (previousPage.includes(UPDATE_BUSINESS_ADDRESS_CONFIRM)) {
                const updateInProgressBusinessAddress: Address = {
                    premises: acspUpdatedFullProfile.registeredOfficeAddress?.premises,
                    addressLine1: acspUpdatedFullProfile.registeredOfficeAddress?.addressLine1,
                    addressLine2: acspUpdatedFullProfile.registeredOfficeAddress?.addressLine2,
                    locality: acspUpdatedFullProfile.registeredOfficeAddress?.locality,
                    region: acspUpdatedFullProfile.registeredOfficeAddress?.region,
                    country: acspUpdatedFullProfile.registeredOfficeAddress?.country,
                    postalCode: acspUpdatedFullProfile.registeredOfficeAddress?.postalCode
                };
                session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressBusinessAddress);
                dateOfChange = session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS);
            }
        }
        if (typeof dateOfChange === "string" && dateOfChange.trim() !== "") {
            const date = new Date(dateOfChange);
            payload = {
                "change-year": date.getFullYear(),
                "change-month": date.getMonth() + 1,
                "change-day": date.getDate()
            };
        }

        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

        // Save the AML removal index and body to the session to send to remove aml url
        if (req.query.amlindex && req.query.amlbody) {
            session.setExtraData(AML_REMOVAL_INDEX, req.query.amlindex);
            session.setExtraData(AML_REMOVAL_BODY, req.query.amlbody);
        }
        const isAmlSupervisionStart = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        const isAmlSupervisionEnd = !!previousPage.includes(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);

        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            cancelTheUpdateUrl,
            currentUrl,
            isAmlSupervisionStart,
            isAmlSupervisionEnd,
            payload,
            return: req.query.return
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
                // When going back and changing date of change, filter out previous entry and add updated one to array
                const removedAMLDetails: AmlSupervisoryBody[] = (session.getExtraData(AML_REMOVED_BODY_DETAILS) ?? []);
                const updatedRemovedAMLDetails = [
                    ...removedAMLDetails.filter(
                        d => !(d.amlSupervisoryBody === amlRemovalBody && d.membershipId === amlRemovalIndex)
                    ),
                    {
                        amlSupervisoryBody: amlRemovalBody,
                        membershipId: amlRemovalIndex,
                        dateOfChange: dateOfChange.toISOString()
                    }
                ];
                session.setExtraData(AML_REMOVED_BODY_DETAILS, updatedRemovedAMLDetails);
                if (req.query.return === "your-updates") {
                    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
                } else {
                    res.redirect(addLangToUrl(`${UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR}?amlindex=${amlRemovalIndex}&amlbody=${amlRemovalBody}&return=your-updates`, lang));
                }
            } else {
                updateWithTheEffectiveDateAmendment(req, dateOfChange.toISOString());
                res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
            }
        }
    } catch (err) {
        next(err);
    }
};
