import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../../src/main/middleware/session_middleware";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_NUMBER } from "../../../src/main/common/__utils/constants";

jest.mock("ioredis");
jest.mock("../../src/middleware/session_middleware");

// get handle on mocked function
const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export const session = new Session();
const NUMBER = "1234567";
const URL = "test/return-url";

// tell the mock what to return
mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    session.data.extra_data[COMPANY_NUMBER] = NUMBER;
    next();
});

export default mockSessionMiddleware;
