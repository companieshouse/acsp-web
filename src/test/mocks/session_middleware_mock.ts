import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../../src/main/middleware/session_middleware";
import { COMPANY, COMPANY_DETAILS, USER_DATA, SUBMISSION_ID, PREVIOUS_PAGE_URL } from "../../../src/main/common/__utils/constants";
import { Company } from "../../main/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";
import { validCompanyProfile } from "./company_profile_mock";

jest.mock("ioredis");
jest.mock("../../../src/main/middleware/session_middleware");

// get handle on mocked function
export const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const session = getSessionRequestWithPermission();

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, validCompanyProfile);
    session.setExtraData(USER_DATA, {
        firstName: "John",
        lastName: "Doe"
    }
    );
    session.setExtraData(SUBMISSION_ID, "validTransactionId");
    session.setExtraData(PREVIOUS_PAGE_URL, "register-as-companies-house-authorised-agent/what-business-type");
    req.session = session;
    next();
});

export default mockSessionMiddleware;
