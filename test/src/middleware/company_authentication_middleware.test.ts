import request from "supertest";
import { Request, Response, NextFunction } from "express";
import { companyAuthenticationMiddleware } from "../../../src/middleware/company_authentication_middleware";
import { BASE_URL } from "../../../src/types/pageURL";
import mocks from "../../mocks/all_middleware_mock";
import { sessionMiddleware } from "../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { USER_DATA, COMPANY_NUMBER } from "../../../src/common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import mockSessionMiddleware from "../../mocks/session_middleware_mock";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

const mockAuthMiddleware = jest.fn();
const mockCompanyAuthMiddleware = jest.fn();
jest.mock("@companieshouse/web-security-node", () => ({
    authMiddleware: jest.fn(() => mockAuthMiddleware),
    companyAuthMiddleware: jest.fn(() => mockCompanyAuthMiddleware)
}));

let req = {} as Request;

describe("company authentication middleware tests", () => {

    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it("should not return 500 error page", async () => {
    //     const response = await request(app).get(BASE_URL);

    //     expect(response.text).not.toContain("Sorry, there is a problem with this service");
    // });

    it("should ask for auth code when companyAuthCodeProvided is false ", () => {
        req = {
            session: getSessionRequestWithExtraData1(),
            originalUrl: "/register-as-companies-house-authorised-agent/limited/what-is-your-role?lang=en"
        } as unknown as Request;
        companyAuthenticationMiddleware(req, mockResponse, mockNext);
        expect(mockAuthMiddleware).toHaveBeenCalled();
    });

    it("should not ask for auth code when companyAuthCodeProvided is true ", () => {
        req = {
            session: getSessionRequestWithExtraData2(),
            originalUrl: "/register-as-companies-house-authorised-agent/limited/what-is-your-role?lang=en"
        } as unknown as Request;
        companyAuthenticationMiddleware(req, mockResponse, mockNext);
        expect(mockAuthMiddleware).not.toHaveBeenCalled();
    });
});

function getSessionRequestWithExtraData1 (): Session {
    const session = getSessionRequestWithPermission();

    session.setExtraData(USER_DATA, {
        companyAuthCodeProvided: false
    });
    session.setExtraData(COMPANY_NUMBER, "NI038379");
    return session;
}

function getSessionRequestWithExtraData2 (): Session {
    const session = getSessionRequestWithPermission();

    session.setExtraData(USER_DATA, {
        companyAuthCodeProvided: true
    });
    session.setExtraData(COMPANY_NUMBER, "NI038379");
    return session;
}
