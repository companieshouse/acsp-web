import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../lib/countryList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { UPDATE_WHERE_DO_YOU_LIVE, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_ACSP_CHANGE_DETAILS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { WhereDoYouLivBodyService } from "../../../services/where-do-you-live/whereDoYouLive";
import { REQ_TYPE_UPDATE_ACSP, USER_DATA } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    // Ideally, acspData should never be null, but since the updateAcspDetails page is not yet developed,
    // acspData is always null. To avoid errors and allow testing, we use:
    // const acspData: AcspData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : {};
    // This ensures functionality until the page is ready, at which point we can handle null separately.
    const acspData: AcspData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : {};
    const currentUrl: string = UPDATE_WHERE_DO_YOU_LIVE;

    const { payload, countryInput } = new WhereDoYouLivBodyService().getCountryPayload(acspData);
    const reqType = REQ_TYPE_UPDATE_ACSP;
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_CHANGE_DETAILS, lang),
        currentUrl,
        countryList: countryList,
        firstName: acspData?.applicantDetails?.firstName,
        lastName: acspData?.applicantDetails?.lastName,
        countryInput,
        payload,
        reqType
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const reqType = REQ_TYPE_UPDATE_ACSP;
    const currentUrl: string = UPDATE_WHERE_DO_YOU_LIVE;

    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_CHANGE_DETAILS, lang);
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
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
        if (acspData) {
            const applicantDetails = acspData.applicantDetails || {};
            applicantDetails.countryOfResidence = countryOfResidence;
            acspData.applicantDetails = applicantDetails;
        }
        saveDataInSession(req, USER_DATA, acspData);
        res.redirect(previousPage);

    }
};
