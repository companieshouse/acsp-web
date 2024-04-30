import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, TYPE_OF_BUSINESS, SOLE_TRADER_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        editPage: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
        title: "Confirm the correspondence address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        correspondenceAddress: acspData?.address
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
    detailsAnswers.correspondenceAddress = acspData.address?.propertyDetails + " " + acspData.address?.line1 + "<br>" + acspData.address?.country + "<br>" + acspData.address?.postcode;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR, lang));
};
