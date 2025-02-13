import { Request, Response, NextFunction } from "express";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { amlSupervisor } from "../../../services/update-acsp/amlSupervisorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    amlSupervisor(req);
    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, selectLang(req.query.lang)));
};
