import { Request, Response, NextFunction } from "express";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { removeAMLSupervisor } from "../../../services/update-acsp/removeAmlSupervisorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    removeAMLSupervisor(req);
    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, selectLang(req.query.lang)));
};
