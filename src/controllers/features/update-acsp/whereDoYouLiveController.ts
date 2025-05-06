import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../lib/countryList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { UPDATE_WHERE_DO_YOU_LIVE, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { WhereDoYouLiveBodyService } from "../../../services/where-do-you-live/whereDoYouLive";
import { ACSP_DETAILS_UPDATED, ACSP_UPDATE_PREVIOUS_PAGE_URL, ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        let payload;
        const updateInProgress:string| undefined = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        if (updateInProgress) {
            payload = new WhereDoYouLiveBodyService().getCountryPayloadInProgress(updateInProgress);
        } else {
            const acspData: AcspData | AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
            let countryOfResidence: string | undefined;
            if ("applicantDetails" in acspData) {
                countryOfResidence = acspData.applicantDetails?.countryOfResidence;
            } else if ("soleTraderDetails" in acspData) {
                countryOfResidence = acspData.soleTraderDetails?.usualResidentialCountry;
            }
            if (!countryOfResidence) {
                payload = "";
            } else {
                payload = new WhereDoYouLiveBodyService().getCountryPayloadInProgress(countryOfResidence);
            }
        }

        res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE,
            countryList: countryList,
            payload
        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
                ...getLocaleInfo(locales, lang),
                previousPage,
                currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE,
                countryList: countryList,
                payload: req.body,
                ...pageProperties
            });
        } else {
            let countryOfResidence;
            if (req.body.whereDoYouLiveRadio === "countryOutsideUK") {
                countryOfResidence = req.body.countryInput;
            } else {
                countryOfResidence = req.body.whereDoYouLiveRadio;
            }
            saveDataInSession(req, ACSP_DETAILS_UPDATE_IN_PROGRESS, countryOfResidence);
            session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_WHERE_DO_YOU_LIVE);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
        }
    } catch (error) {
        next(error);
    }
};
