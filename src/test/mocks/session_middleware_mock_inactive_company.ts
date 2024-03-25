import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../main/middleware/session_middleware";
import { COMPANY, COMPANY_DETAILS } from "../../main/common/__utils/constants";
import { Company } from "../../main/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";
import { invalidCompanyProfile } from "./company_profile_mock";
import { logger } from "../../main/utils/logger";

jest.mock("ioredis");
jest.mock("../../../src/main/middleware/session_middleware");

export const mockSessionMiddlewareWithInactiveCompany = sessionMiddleware as jest.Mock;

export const session = getSessionRequestWithPermission();
const NUMBER = "1234567";
const URL = "test/return-url";

// tell the mock what to return
mockSessionMiddlewareWithInactiveCompany.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    logger.info("Inactive is called");
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, invalidCompanyProfile);
    req.session = session;
    next();
});
