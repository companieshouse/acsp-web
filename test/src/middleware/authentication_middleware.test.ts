/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { acspProfileCreateAuthMiddleware, authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticationMiddleware } from "../../../src/middleware/authentication_middleware";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../../../src/types/pageURL";
import * as module from "../../../src/utils/environment/environment_value";

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

    it("should call CH authentication library", () => {

        // (getEnvironmentValue as jest.Mock).mockImplementation(() => {return "true"});

        
        authenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunctionAuthMiddleware).toHaveBeenCalledWith(req, res, next);
    });
    it("should call CH authentication library", () => {
        jest.spyOn(module, "getEnvironmentValue").mockImplementation(() => {return "false"});
        authenticationMiddleware(req, res, next);
        expect(mockAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunctionAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(req, res, next);
    });
});