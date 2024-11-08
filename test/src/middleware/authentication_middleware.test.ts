/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { acspProfileCreateAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticationMiddleware } from "../../../src/middleware/authentication_middleware";
import { BASE_URL, CHECK_SAVED_APPLICATION, LIMITED_WHAT_IS_YOUR_ROLE } from "../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { USER_DATA, COMPANY_NUMBER } from "../../../src/common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";

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

const expectedAuthMiddlewareConfigWithWhatisRoleURL: AuthOptions = {
    chsWebUrl: "http://chs.local",
    returnUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE
};

describe("authentication middleware tests", () => {
    it("should call CH authentication library", () => {
        authenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should call CH authentication library with Limited URL when session is available ", () => {
        let request = {} as Request;
        const Url = BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE;
        request = {
            session: getSessionRequestWithExtraData(true),
            originalUrl: Url
        } as unknown as Request;
        authenticationMiddleware(request, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfigWithWhatisRoleURL);
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
