/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { acspProfileCreateAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticationMiddlewareForSoleTrader } from "../../../src/middleware/authentication_middleware_sole_trader";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../../../src/types/pageURL";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = acspProfileCreateAuthMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const req: Request = {} as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
};

describe("authentication middleware tests", () => {
    it("should call CH authentication library", () => {
        authenticationMiddlewareForSoleTrader(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });
});
