import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../../src/main/middleware/session_middleware";
import { COMPANY, COMPANY_DETAILS } from "../../../src/main/common/__utils/constants";
import { Company } from "../../main/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";
import { validCompanyProfile, invalidCompanyProfile } from "./company_profile_mock";

jest.mock("ioredis");
jest.mock("../../../src/main/middleware/session_middleware");

// get handle on mocked function
export const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const mockSessionMiddlewareWithInactiveCompany = sessionMiddleware as jest.Mock;

export const session = getSessionRequestWithPermission();
const NUMBER = "1234567";
const URL = "test/return-url";

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, validCompanyProfile);
    req.session = session;
    next();
});

mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, invalidCompanyProfile);
    req.session = session;
    next();
});
