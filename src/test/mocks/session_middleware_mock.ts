import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../../src/main/middleware/session_middleware";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY, COMPANY_NUMBER } from "../../../src/main/common/__utils/constants";
import { Company } from "main/model/Company";
import { getSessionRequestWithPermission } from "./session.mock";

jest.mock("ioredis");
jest.mock("../../../src/main/middleware/session_middleware");

// get handle on mocked function
const mockSessionMiddleware = sessionMiddleware as jest.Mock;
export const session = getSessionRequestWithPermission();
const NUMBER = "1234567";
const URL = "test/return-url";

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const company : Company = {
        companyName: "My Company"
    };
    session.setExtraData(COMPANY, company);
    next();
});

export default mockSessionMiddleware;
