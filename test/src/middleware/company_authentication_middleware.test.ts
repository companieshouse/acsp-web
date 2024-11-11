import { Request, Response, NextFunction } from "express";
import { companyAuthenticationMiddleware } from "../../../src/middleware/company_authentication_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { USER_DATA, COMPANY_NUMBER } from "../../../src/common/__utils/constants";
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

    it("should ask for auth code when companyAuthCodeProvided is false ", () => {
        req = {
            session: getSessionRequestWithExtraData(false),
            originalUrl: Url
        } as unknown as Request;
        companyAuthenticationMiddleware(req, mockResponse, mockNext);
        expect(mockAuthMiddleware).toHaveBeenCalled();
    });

    it("should not ask for auth code when companyAuthCodeProvided is true ", () => {
        req = {
            session: getSessionRequestWithExtraData(true),
            originalUrl: Url
        } as unknown as Request;
        companyAuthenticationMiddleware(req, mockResponse, mockNext);
        expect(mockAuthMiddleware).not.toHaveBeenCalled();
    });
});

function getSessionRequestWithExtraData (value: Boolean): Session {
    const session = getSessionRequestWithPermission();

    session.setExtraData(USER_DATA, {
        companyAuthCodeProvided: value
    });
    session.setExtraData(COMPANY_NUMBER, "NI038379");
    return session;
}
