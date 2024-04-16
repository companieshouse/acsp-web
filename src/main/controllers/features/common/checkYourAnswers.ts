import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { BASE_URL, CHECK_YOUR_ANSWERS, PAYMENT_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { ANSWER_DATA, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session.getExtraData(USER_DATA)!;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA)!;
    res.render(config.CHECK_YOUR_ANSWERS, {
        title: "Check your answers before sending your application",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + CHECK_YOUR_ANSWERS,
        typeOfBusiness: acspData.typeofBusiness,
        detailsAnswers
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        res.redirect(addLangToUrl(BASE_URL + PAYMENT_URL, lang));
    } catch (error) {
        next(error);
    }
};
