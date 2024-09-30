import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_NAME_REGISTERED_WITH_AML, TYPE_OF_BUSINESS, AML_REGISTRATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { APPLICATION_ID, SUBMISSION_ID } from "../../../common/__utils/constants";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT;

    try {
        const applicationId: string = session.getExtraData(APPLICATION_ID)!;
        // update typeOfBusiness in DB
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, applicationId);
        acspData.typeOfBusiness = "SOLE_TRADER";
        const acspDataService = new AcspDataService();
        await acspDataService.saveAcspData(session, acspData);

        res.render(config.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
            soleTrader: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
            amlRegistration: addLangToUrl(AML_REGISTRATION, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl
        });

    } catch (err) {
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
