import { NextFunction, Request, Response } from "express";
import { BASE_URL, CANNOT_USE_SERVICE_WHILE_SUSPENDED, CLOSE_ACSP_BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../types/pageURL";
import { selectLang, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

    let baseUrl;
    if (req.originalUrl.includes(UPDATE_ACSP_DETAILS_BASE_URL)) {
        baseUrl = UPDATE_ACSP_DETAILS_BASE_URL;
    } else if (req.originalUrl.includes(CLOSE_ACSP_BASE_URL)) {
        baseUrl = CLOSE_ACSP_BASE_URL;
    } else {
        baseUrl = BASE_URL;
    }

    res.render(config.CANNOT_USE_SERVICE_WHILE_SUSPENDED, {
        ...getLocaleInfo(getLocalesService(), lang),
        currentUrl: baseUrl + CANNOT_USE_SERVICE_WHILE_SUSPENDED,
        businessName: acspDetails.name
    });
};
