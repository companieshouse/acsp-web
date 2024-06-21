import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { AML_BODY_DETAILS_CONFIRM, YOUR_RESPONSIBILITIES, BASE_URL, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.YOUR_RESPONSIBILITIES, {
        previousPage: addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang),
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + YOUR_RESPONSIBILITIES,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        businessName: acspData?.businessName,
        typeOfBusiness: acspData?.typeOfBusiness
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang));
};
