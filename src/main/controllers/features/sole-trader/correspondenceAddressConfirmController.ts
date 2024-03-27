import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;

    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const { firstName, lastName, addresses } = acspData;

    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        editPage: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
        title: "Confirm the correspondence address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM,
        firstName,
        lastName,
        correspondenceAddress: addresses ? addresses[0] : ""
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(BASE_URL + TYPE_OF_BUSINESS);
};
