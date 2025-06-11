import { CLOSE_ACSP_BASE_URL, AUTHORISED_AGENT, CLOSE_FEEDBACK_LINK } from "../../types/pageURL";
import { Handler } from "express";
import { addLangToUrl } from "../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getBusinessName } from "../../services/common";

/**
 * Populates variables for use in templates that are used on multiple pages.
 * All variables in res.locals will be availble for use in templates.
 * e.g. res.locals.userEmail can be used as {{userEmail}} in the template.
 *
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const closeVariablesMiddleware: Handler = (req, res, next) => {

    const session: Session = req.session as any as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

    res.locals.serviceName = "Close the authorised agent account";
    res.locals.serviceUrl = CLOSE_ACSP_BASE_URL;
    res.locals.tabTitleKey = "CommonTabTitleCloseAcsp";
    res.locals.authorisedAgentDashboardUrl = addLangToUrl(AUTHORISED_AGENT, res.locals.lang);
    res.locals.feedbackLink = CLOSE_FEEDBACK_LINK;

    if (acspDetails) {
        res.locals.businessName = getBusinessName(acspDetails.name);
    }
    next();
};
