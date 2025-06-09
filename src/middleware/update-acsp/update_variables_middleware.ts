import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_FEEDBACK_LINK } from "../../types/pageURL";
import { REQ_TYPE_UPDATE_ACSP, ACSP_DETAILS } from "../../common/__utils/constants";
import { Handler } from "express";
import { Session } from "@companieshouse/node-session-handler";
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
export const updateVariablesMiddleware: Handler = (req, res, next) => {

    const session: Session = req.session as any as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

    res.locals.serviceName = "View and update the authorised agent's details";
    res.locals.serviceUrl = UPDATE_ACSP_DETAILS_BASE_URL;
    res.locals.reqType = REQ_TYPE_UPDATE_ACSP;
    res.locals.tabTitleKey = "CommonTabTitleUpdateAcsp";
    res.locals.feedbackLink = UPDATE_FEEDBACK_LINK;

    if (acspDetails) {
        res.locals.businessName = getBusinessName(acspDetails.name);
    }

    next();
};
