import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../src/middleware/session_middleware";
import { COMPANY, COMPANY_DETAILS, USER_DATA, SUBMISSION_ID, PREVIOUS_PAGE_URL, ADDRESS_LIST, ACSP_DETAILS, ACSP_DETAILS_UPDATED, NEW_AML_BODY, NEW_AML_BODIES, ADD_AML_BODY_UPDATE } from "../../src/common/__utils/constants";
import { Company } from "../../src/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";
import { validCompanyProfile } from "./company_profile_mock";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { addressList } from "./address.mock";
import { dummyFullProfile } from "./acsp_profile.mock";

jest.mock("ioredis");
jest.mock("../../src/middleware/session_middleware");

// get handle on mocked function
export const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const session = getSessionRequestWithPermission();

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const company : Company = {
        companyName: "My Company"
    };
    const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];
    amlSupervisoryBodies.push({
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
    });
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, validCompanyProfile);
    session.setExtraData(USER_DATA, {
        amlSupervisoryBodies: amlSupervisoryBodies,
        applicantDetails: {
            firstName: "John",
            lastName: "Doe"
        }
    }
    );
    session.setExtraData(SUBMISSION_ID, "validTransactionId");
    session.setExtraData(PREVIOUS_PAGE_URL, "register-as-companies-house-authorised-agent/what-business-type");
    session.setExtraData("payment-nonce", "123456");
    session.setExtraData("resume_application", true);
    session.setExtraData(ADDRESS_LIST, addressList);
    session.setExtraData(ACSP_DETAILS, dummyFullProfile);
    session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
    session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "association-of-chartered-certified-accountants-acca" });
    session.setExtraData(NEW_AML_BODIES, [{ amlSupervisoryBody: "association-of-chartered-certified-accountants-acca", membershipId: "12345" }]);
    req.session = session;
    next();
});

export default mockSessionMiddleware;
