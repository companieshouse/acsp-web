import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS, AML_MEMBERSHIP_NUMBER, REMOVE_AML_SUPERVISOR } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { getDateOfChangeFromSession, getPreviousPageUrlDateOfChange, setUpdateInProgressAndGetDateOfChange, updateWithTheEffectiveDateAmendment } from "../../../services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "../../../model/AcspFullProfile";
import { ACSP_DETAILS_UPDATED, NEW_AML_BODY, ADD_AML_BODY_UPDATE, AML_REMOVAL_BODY, AML_REMOVAL_INDEX, AML_REMOVED_BODY_DETAILS, ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + getPreviousPageUrlDateOfChange(req), lang);
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const updateInProgress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        const newAmlBody = session.getExtraData(NEW_AML_BODY);
        let updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
        let amlBody: AmlSupervisoryBody = {};
        let payload = {};
        let dateOfChange: any = null;

        if (newAmlBody && updateBodyIndex !== undefined) {
            dateOfChange = acspUpdatedFullProfile.amlDetails[updateBodyIndex].dateOfChange;
        } else if (!newAmlBody && previousPage.includes(AML_MEMBERSHIP_NUMBER)) {
            if (!updateBodyIndex) {
                updateBodyIndex = acspUpdatedFullProfile.amlDetails.length - 1;
                session.setExtraData(ADD_AML_BODY_UPDATE, updateBodyIndex);
            }
            const amlDetail = acspUpdatedFullProfile.amlDetails[updateBodyIndex];
            amlBody = getAmlDetailPayload(amlDetail);
            dateOfChange = amlBody.dateOfChange;
            session.setExtraData(NEW_AML_BODY, amlBody);
        } else if (session.getExtraData(AML_REMOVAL_INDEX) &&
                session.getExtraData(AML_REMOVAL_BODY) &&
                session.getExtraData(AML_REMOVED_BODY_DETAILS)) {
            const removalDate = handleAmlRemoval(session);
            if (removalDate) {
                dateOfChange = removalDate;
            }
        } else {
            if (updateInProgress) {
                dateOfChange = getDateOfChangeFromSession(previousPage, session);
            } else {
                dateOfChange = setUpdateInProgressAndGetDateOfChange(previousPage, acspUpdatedFullProfile, session);
            }
        }
        payload = buildDatePayload(dateOfChange);

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

function handleAmlRemoval (session: Session) {
    const removalIndex = session.getExtraData(AML_REMOVAL_INDEX);
    const removalBody = session.getExtraData(AML_REMOVAL_BODY);
    const removedBodyDetails = session.getExtraData(AML_REMOVED_BODY_DETAILS);
    if (removalIndex && removalBody && removedBodyDetails) {
        const removedAMLData = removedBodyDetails as AmlSupervisoryBody[];
        const indexAMLForUndoRemoval = removedAMLData.findIndex(tmpRemovedAml =>
            tmpRemovedAml.amlSupervisoryBody === removalBody &&
            tmpRemovedAml.membershipId === removalIndex
        );
        return removedAMLData[indexAMLForUndoRemoval]?.dateOfChange || null;
    }
    return null;
}

function getAmlDetailPayload (amlDetails: any): AmlSupervisoryBody {
    return {
        amlSupervisoryBody: amlDetails.supervisoryBody,
        membershipId: amlDetails.membershipDetails,
        dateOfChange: amlDetails.dateOfChange instanceof Date
            ? amlDetails.dateOfChange.toISOString()
            : amlDetails.dateOfChange
    };
}

export const buildDatePayload = (dateOfChange: string) => {
    if (typeof dateOfChange === "string" && dateOfChange.trim() !== "") {
        const date = new Date(dateOfChange);
        return {
            "change-year": date.getFullYear(),
            "change-month": date.getMonth() + 1,
            "change-day": date.getDate()
        };
    }
    return {};
};
