import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    req.session.user = req.session.user || {};
    const { firstName, lastName, correspondenceAddress } = req.session.user;

    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, {
        previousPage: addLangToUrl(SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        editPage: addLangToUrl(SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
        title: "Confirm the correspondence address",
        ...getLocaleInfo(locales, lang),
        currentUrl: SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM,
        firstName,
        lastName,
        correspondenceAddress: correspondenceAddress || req.session.user.originalAddress
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    req.session.user = req.session.user || {};

    req.session.user.originalAddress = req.session.user.originalAddress || {};
    req.session.user.originalAddress = req.session.user.correspondenceAddress;
    res.redirect("/type-of-acsp");
};
