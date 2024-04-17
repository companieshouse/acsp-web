import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ANSWER_DATA, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { ACSPData } from "../../../model/ACSPData";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
        editAddress: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang),
        title: "Confirm the business address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM,
        businessName: acspData?.businessName,
        businessAddress: acspData?.businessAddress
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};

    detailsAnswers.businessAddress = acspData.businessAddress?.propertyDetails + " " + acspData.businessAddress?.line1 + "<br>" + acspData.businessAddress?.country + "<br>" + acspData.businessAddress?.postcode;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);

    res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang));
};
