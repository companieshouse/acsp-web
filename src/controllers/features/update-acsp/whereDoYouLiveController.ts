import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../lib/countryList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { UPDATE_WHERE_DO_YOU_LIVE, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { WhereDoYouLivBodyService } from "../../../services/where-do-you-live/whereDoYouLive";
import { REQ_TYPE_UPDATE_ACSP, ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

    const payload = new WhereDoYouLivBodyService().getCountryPayload(acspData);
    const reqType = REQ_TYPE_UPDATE_ACSP;
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
        currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE,
        countryList: countryList,
        firstName: acspData?.soleTraderDetails?.forename,
        lastName: acspData?.soleTraderDetails?.surname,
        payload,
        reqType
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const reqType = REQ_TYPE_UPDATE_ACSP;

    const session: Session = req.session as any as Session;
    var acspDataUpdated: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE,
            countryList: countryList,
            ...pageProperties,
            payload: req.body,
            reqType
        });
    } else {
        let countryOfResidence;
        if (req.body.whereDoYouLiveRadio === "countryOutsideUK") {
            countryOfResidence = req.body.countryInput;
        } else {
            countryOfResidence = req.body.whereDoYouLiveRadio;
        }
        if (acspDataUpdated) {
            const applicantDetails = acspDataUpdated.soleTraderDetails || {};
            applicantDetails.usualResidentialCountry = countryOfResidence;
            acspDataUpdated.soleTraderDetails = applicantDetails;
        }
        saveDataInSession(req, ACSP_DETAILS_UPDATED, acspDataUpdated);
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, null);
        const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang);
        res.redirect(nextPageUrl);

    }
};
