import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_APPLICATION_CONFIRMATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, UPDATE_SUBMISSION_ID } from "../../../common/__utils/constants";
import { deleteAllSessionData } from "../../../common/__utils/sessionHelper";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION;
    try {
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const email: string = acspFullProfile.email;
        const transactionId: string = session.getExtraData(UPDATE_SUBMISSION_ID)!;

        await deleteAllSessionData(session);

        res.render(config.UPDATE_ACSP_DETAILS_APPLICATION_CONFIRMATION, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            surveyLink: "#",
            email,
            transactionId
        });
    } catch (err) {
        next(err);
    }
};
