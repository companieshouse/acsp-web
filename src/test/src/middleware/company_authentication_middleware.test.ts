import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../../../main/app";
import { companyAuthenticationMiddleware } from "../../../main/middleware/company_authentication_middleware";

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

const mockAuthMiddleware = jest.fn();
const mockCompanyAuthMiddleware = jest.fn();
jest.mock("@companieshouse/web-security-node", () => ({
    authMiddleware: jest.fn(() => mockAuthMiddleware),
    companyAuthMiddleware: jest.fn(() => mockCompanyAuthMiddleware)
}));

describe("company authentication middleware tests", () => {

    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not return 500 error page if feature flag is active", async () => {
        const response = await request(app).get("/appoint-update-remove-company-officer");

        expect(response.text).not.toContain("Sorry, there is a problem with this service");
    });

    it("should call next if originalUrl includes '/cannot-use'", () => {
        mockRequest.url = "http://some-chs-endpoint/company/cannot-use";
        mockRequest.params = { PARAM_COMPANY_NUMBER: "12345678" };
        companyAuthenticationMiddleware(mockRequest, mockResponse, mockNext);
        expect(mockAuthMiddleware).toHaveBeenCalled();
        expect(mockCompanyAuthMiddleware).not.toHaveBeenCalled();
    });

    it("should call authMiddleware with correct config if originalUrl does not include '/cannot-use'", () => {
        mockRequest.url = "http://some-chs-endpoint/company/some-url";
        mockRequest.params = { PARAM_COMPANY_NUMBER: "12345678" };

        companyAuthenticationMiddleware(mockRequest, mockResponse, mockNext);
        expect(mockAuthMiddleware).toHaveBeenCalled();
        expect(mockAuthMiddleware).toHaveBeenCalledWith(
            {
                url: "http://some-chs-endpoint/company/some-url",
                params: {
                    PARAM_COMPANY_NUMBER: "12345678"
                }
            },
            {},
            mockNext
        );
        expect(mockCompanyAuthMiddleware).not.toHaveBeenCalled();
    });
});
