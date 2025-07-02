/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { acspManageUsersAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import * as sessionUtils from "../../../../src/common/__utils/session";
import { closeAcspAuthMiddleware } from "../../../../src/middleware/close-acsp/close_acsp_authentication_middleware";
import { CLOSE_ACSP_BASE_URL } from "../../../../src/types/pageURL";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = acspManageUsersAuthMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const getLoggedInAcspNumberSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInAcspNumber");

const req: Request = {} as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: CLOSE_ACSP_BASE_URL,
    acspNumber: "ABC123"
};

describe("acsp authentication middleware tests", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should call CH authentication library", () => {
        getLoggedInAcspNumberSpy.mockReturnValue("ABC123");
        closeAcspAuthMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });
});
