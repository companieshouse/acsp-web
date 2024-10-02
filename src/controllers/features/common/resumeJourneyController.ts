import { Request, Response } from "express";
import { BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { selectLang, addLangToUrl } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { SUBMISSION_ID } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";

export const get = async (req: Request, res: Response) => {
    const lang = selectLang(req.query.lang);
    const transactionId = req.query.transactionId;
    const acspId = req.query.acspId;
    const session: Session = req.session as any as Session;
    const infoMsg = `Transaction ID: ${transactionId}, Acsp Id ID: ${acspId}`;
    logger.infoRequest(req, `Resuming ACSP application - ${infoMsg}`);
    session.setExtraData(SUBMISSION_ID, transactionId);
    res.locals.userId = session?.data?.signin_info?.user_profile?.id;
    res.locals.applicationId = acspId;
    const nextPageUrl = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
    res.redirect(nextPageUrl);
};