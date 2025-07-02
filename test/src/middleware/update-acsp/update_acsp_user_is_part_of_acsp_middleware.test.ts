import { Request, Response } from "express";
import * as sessionUtils from "../../../../src/common/__utils/session";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import * as localise from "../../../../src/utils/localise";
import { updateAcspUserIsPartOfAcspMiddleware } from "../../../../src/middleware/update-acsp/update_acsp_user_is_part_of_acsp_middleware";

const getLoggedInAcspNumberSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInAcspNumber");

describe("userIsPartOfAcspMiddleware", () => {
    let req: MockRequest<Request>;
    let res: Partial<Response>;
    const next = jest.fn();

    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/"
        });
        res = {
            redirect: jest.fn()
        };
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should call res.redirect() if no acspNumber in session", async () => {
        getLoggedInAcspNumberSpy.mockReturnValue(undefined);
        updateAcspUserIsPartOfAcspMiddleware(req, res as Response, next);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next() when acspNumber is present in session", async () => {
        getLoggedInAcspNumberSpy.mockReturnValue("ABC123");
        updateAcspUserIsPartOfAcspMiddleware(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it("should pass through any caught errors", async () => {
        const error = new Error("Test error");
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw error;
        });

        await updateAcspUserIsPartOfAcspMiddleware(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
