import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { AUTHORISED_AGENT, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_APPLICATION_CONFIRMATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { UPDATE_SUBMISSION_ID } from "../../../common/__utils/constants";
import { deleteAllSessionData } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION;
        const transactionId: string = session.getExtraData(UPDATE_SUBMISSION_ID)!;

        await deleteAllSessionData(session);

        res.render(config.UPDATE_ACSP_DETAILS_APPLICATION_CONFIRMATION, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            authorisedAgentAccountLink: addLangToUrl(AUTHORISED_AGENT, lang),
            transactionId
        });
    } catch (err) {
        next(err);
    }
};
