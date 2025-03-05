import { Request, Response, NextFunction } from "express";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { amlSupervisor } from "../../../services/update-acsp/amlSupervisorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        amlSupervisor(req);
        if (req.query.return === "your-updates") {
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, selectLang(req.query.lang)));
        } else {
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, selectLang(req.query.lang)));
        }
    } catch (error) {
        next(error);
    }
};
