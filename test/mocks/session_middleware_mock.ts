import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../src/middleware/session_middleware";
import { COMPANY, COMPANY_DETAILS, USER_DATA, SUBMISSION_ID, AML_SUPERVISOR_SELECTED, PREVIOUS_PAGE_URL, ADDRESS_LIST } from "../../src/common/__utils/constants";
import { Company } from "../../src/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";
import { validCompanyProfile } from "./company_profile_mock";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { addressList } from "./address.mock";

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
        firstName: "John",
        lastName: "Doe",
        amlSupervisoryBodies: amlSupervisoryBodies,
        applicantDetails:{
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
    req.session = session;
    next();
});

export default mockSessionMiddleware;
