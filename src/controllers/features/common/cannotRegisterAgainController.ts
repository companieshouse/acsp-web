import { NextFunction, Request, Response } from "express";
import { AUTHORISED_AGENT, BASE_URL, CANNOT_REGISTER_AGAIN } from "../../../types/pageURL";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.render(config.CANNOT_REGISTER_AGAIN, {
        ...getLocaleInfo(getLocalesService(), lang),
        currentUrl: BASE_URL + CANNOT_REGISTER_AGAIN,
        previousPage: addLangToUrl(BASE_URL, lang),
        authorisedAgentLink: AUTHORISED_AGENT
    });
};
