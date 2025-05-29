import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { trimAndLowercaseString } from "../../../services/common";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRMATION_ACSP_CLOSED, STRIKE_OFF_YOUR_COMPANY, TELL_HMRC_YOUVE_STOPPED_TRADING } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, CLOSE_SUBMISSION_ID } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const loginEmail = trimAndLowercaseString(res.locals.userEmail);
        const correspondenceEmail = trimAndLowercaseString(acspDetails.email);
        const showBothEmails = loginEmail !== correspondenceEmail;

        res.render(config.CLOSE_CONFIRMATION_ACSP_CLOSED, {
            ...getLocaleInfo(locales, lang),
            currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_CONFIRMATION_ACSP_CLOSED,
            loginEmail,
            correspondenceEmail,
            showBothEmails,
            transactionId: session.getExtraData(CLOSE_SUBMISSION_ID)!,
            strikeOffYourLtdCompanyLink: STRIKE_OFF_YOUR_COMPANY,
            tellHmrcIfYouveStoppedTradingLink: TELL_HMRC_YOUVE_STOPPED_TRADING
        });
    } catch (err) {
        next(err);
    }
};
