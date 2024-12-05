/* eslint-disable import/first */
jest.mock("@companieshouse/web-security-node");
process.env.FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY = "false";
import { acspProfileCreateAuthMiddleware, authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticationMiddleware } from "../../../src/middleware/authentication_middleware";
import { BASE_URL, CHECK_SAVED_APPLICATION, LIMITED_WHAT_IS_YOUR_ROLE, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { USER_DATA, COMPANY_NUMBER } from "../../../src/common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";

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

const expectedAuthMiddlewareConfigWithUpdateAcspDetailsURL: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: UPDATE_ACSP_DETAILS_BASE_URL
};

const expectedAuthMiddlewareConfigWithWhatisRoleURL: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE
};

describe("authentication middleware tests", () => {
    it("should call CH authentication library", async () => {
        authenticationMiddleware(req, res, next);
        expect(mockAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunctionAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(req, res, next);
    });

    it("should call CH authentication library with Update ACSP Details URL when session is available", () => {
        let request = {} as Request;
        const Url = UPDATE_ACSP_DETAILS_BASE_URL;
        request = {
            session: getSessionRequestWithExtraData(true),
            originalUrl: Url
        } as unknown as Request;
        authenticationMiddleware(request, res, next);
        expect(mockAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfigWithUpdateAcspDetailsURL);
    });

    it("should call CH authentication library with Limited URL when session is available ", () => {
        let request = {} as Request;
        const Url = BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE;
        request = {
            session: getSessionRequestWithExtraData(true),
            originalUrl: Url
        } as unknown as Request;
        authenticationMiddleware(request, res, next);
        expect(mockAcspProfileCreateAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfigWithWhatisRoleURL);
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
