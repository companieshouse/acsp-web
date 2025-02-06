import { Request, Response, NextFunction } from "express";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { cancelAnUpdate } from "../../../services/update-acsp/cancelAnUpdateService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    await cancelAnUpdate(req);
    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, selectLang(req.query.lang)));
};
