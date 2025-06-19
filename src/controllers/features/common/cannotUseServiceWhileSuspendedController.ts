import { NextFunction, Request, Response } from "express";
import { UPDATE_ACSP_DETAILS_BASE_URL, CANNOT_USE_SERVICE_WHILE_SUSPENDED } from "../../../types/pageURL";
import { selectLang, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.render(config.CANNOT_USE_SERVICE_WHILE_SUSPENDED, {
        ...getLocaleInfo(getLocalesService(), lang),
        currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + CANNOT_USE_SERVICE_WHILE_SUSPENDED
    });
};
