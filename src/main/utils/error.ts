import { Request, Response } from "express";
import * as config from "../config";
import { getLocaleInfo, getLocalesService, selectLang } from "./localise";

export const pageNotFound = (req: Request, res: Response) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    return res.status(404).render(config.ERROR_404, {
        title: "Page not Found",
        ...getLocaleInfo(locales, lang)
    });
};
