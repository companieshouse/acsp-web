/* eslint-disable import/first */
jest.mock("@companieshouse/web-security-node");
process.env.FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY = "true";
import { acspProfileCreateAuthMiddleware, authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../../../src/types/pageURL";
import { authenticationMiddleware } from "../../../src/middleware/authentication_middleware";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = authMiddleware as jest.Mock;
const mockAuthReturnedFunctionAuthMiddleware = jest.fn();

const mockAcspProfileCreateAuthMiddleware = acspProfileCreateAuthMiddleware as jest.Mock;
const mockAuthReturnedFunctionAcspProfileCreateAuthMiddleware = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunctionAuthMiddleware);
mockAcspProfileCreateAuthMiddleware.mockReturnValue(mockAuthReturnedFunctionAcspProfileCreateAuthMiddleware);

const req: Request = {} as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
};

describe("authentication middleware tests", () => {
    it("should call CH authentication library", async () => {
        authenticationMiddleware(req, res, next);
        authenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunctionAuthMiddleware).toHaveBeenCalledWith(req, res, next);
    });

});
