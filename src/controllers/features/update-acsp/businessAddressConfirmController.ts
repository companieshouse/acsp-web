import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_MANUAL, UPDATE_BUSINESS_ADDRESS_LOOKUP, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_UPDATE_PREVIOUS_PAGE_URL, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM;

        let businessAddress;
        if (session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)) {
            businessAddress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        } else {
            businessAddress = acspUpdatedFullProfile.registeredOfficeAddress;
        }

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, {
            previousPage,
            editAddress: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            businessAddress,
            typeOfBusiness: acspUpdatedFullProfile.type
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_BUSINESS_ADDRESS_CONFIRM);
        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
    } catch (err) {
        next(err);
    }
};
