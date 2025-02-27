import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
    const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

    try {
        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const dateOfChange = new Date(
            req.body["change-year"],
            req.body["change-month"] - 1,
            req.body["change-day"]);
        const session: Session = req.session as any as Session;

        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS) === null) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
        } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) === null) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
        } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE) === null) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, dateOfChange);
        } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS) === null) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
        } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS) === null) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS, dateOfChange);
        }
console.log("RITZ45 applicantName: "+session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME)+" whereDoYouLive: "+ 
session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE)+" nameOfBusiness: "+
session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS)+" registeredOfficeAddress: "+
session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS)+" correspondenceAddress: "+
session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS));

        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
    } catch (err) {
        next(err);
    }
};
