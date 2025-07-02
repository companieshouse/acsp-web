import { Request, Response, NextFunction } from "express";
import { companyAuthenticationMiddleware } from "../../../src/middleware/company_authentication_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { COMPANY_NUMBER } from "../../../src/common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { BASE_URL, LIMITED_WHAT_IS_YOUR_ROLE } from "../../../src/types/pageURL";

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

const mockAuthMiddleware = jest.fn();
jest.mock("@companieshouse/web-security-node", () => ({
    authMiddleware: jest.fn(() => mockAuthMiddleware)
}));

let req = {} as Request;

describe("company authentication middleware tests", () => {

    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;
    const Url = BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE;

    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should ask for auth code ", () => {
        req = {
            session: getSessionRequestWithExtraData(),
            originalUrl: Url
        } as unknown as Request;
        companyAuthenticationMiddleware(req, mockResponse, mockNext);
        expect(mockAuthMiddleware).toHaveBeenCalled();
    });
});

function getSessionRequestWithExtraData (): Session {
    const session = getSessionRequestWithPermission();
    session.setExtraData(COMPANY_NUMBER, "NI038379");
    return session;
}
