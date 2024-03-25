import { NextFunction, Request, Response } from "express";
import { COMPANY, COMPANY_DETAILS } from "../../../src/main/common/__utils/constants";
import { sessionMiddleware } from "../../../src/main/middleware/session_middleware";
import { Company } from "../../main/model/Company";
import { logger } from "../../main/utils/logger";
import { validCompanyProfile } from "./company_profile_mock";
import { getSessionRequestWithPermission } from "./session.mock";

jest.mock("ioredis");
jest.mock("../../../src/main/middleware/session_middleware");

// get handle on mocked function
export const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const session = getSessionRequestWithPermission();
const NUMBER = "1234567";
const URL = "test/return-url";

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    logger.info("Active is called");
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    session.setExtraData(COMPANY_DETAILS, validCompanyProfile);
    req.session = session;
    next();
});

export default mockSessionMiddleware;
