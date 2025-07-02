/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { closeAcspBaseAuthenticationMiddleware } from "../../../../src/middleware/close-acsp/close_acsp_base_authentication_middleware";
import { CLOSE_ACSP_BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = authMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const req: Request = {} as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: CLOSE_ACSP_BASE_URL
};

describe("authentication middleware tests", () => {

    it("should call CH authentication library", () => {
        closeAcspBaseAuthenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });
});
