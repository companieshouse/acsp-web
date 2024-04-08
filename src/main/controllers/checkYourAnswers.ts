import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo } from "../utils/localise";
import * as config from "../config";
import { BASE_URL, CHECK_YOUR_ANSWERS } from "../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { DETAIL_ANSWERS } from "../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const answerList = session?.getExtraData(DETAIL_ANSWERS)!;
    res.render(config.CHECK_YOUR_ANSWERS, {
        title: "Check your answers before sending your application",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + CHECK_YOUR_ANSWERS,
        answersList: answerList
    });
};
