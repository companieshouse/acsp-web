import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, BASE_URL, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { CORRESPONDENCE_ADDRESS, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspdata: ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
        editAddress: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, lang),
        title: "Confirm the business address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM,
        businessName: acspdata.companyDetails?.companyName,
        businessAddress: acspdata.companyDetails?.registeredOfficeAddress
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
};
