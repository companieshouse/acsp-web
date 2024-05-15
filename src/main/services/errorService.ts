import { Response } from "express";
import { getLocaleInfo } from "../utils/localise";
import { LocalesService } from "@companieshouse/ch-node-utils";
import * as config from "../config";

export class ErrorService {
    public renderErrorPage = (res:Response, locales:LocalesService, lang:string, currentUrl: string) => {
        res.status(400).render(config.ERROR_404, {
            title: "Page not found",
            ...getLocaleInfo(locales, lang),
            currentUrl: currentUrl
        });
    }
}
