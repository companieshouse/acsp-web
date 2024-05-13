import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { CONFIRMATION, BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { getAcspRegistration } from "../../../services/acspRegistrationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
    res.render(config.APPLICATION_CONFIRMATION, {
        title: "Application submitted",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + CONFIRMATION,
        email: acspData?.id
    });
};
