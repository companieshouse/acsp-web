import { NextFunction, Request, Response } from "express";
import { getSessionRequestWithPermission, acspNumber } from "../../../mocks/session.mock";
import { getAcspProfileMiddleware } from "../../../../src/middleware/close-acsp/close_acsp_get_acsp_profile_middleware";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { createRequest, MockRequest } from "node-mocks-http";
import { Session } from "@companieshouse/node-session-handler";
import { AcspCeasedError } from "../../../../src/errors/acspCeasedError";

jest.mock("../../../../src/services/acspProfileService");

describe("getAcspProfileMiddleware", () => {
    let req: MockRequest<Request>;
    const res: Response = {} as Response;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should call next() when ACSP is active and details exist in session", async () => {
        const session = req.session as any as Session;
        session.setExtraData(ACSP_DETAILS, { status: "active" });

        await getAcspProfileMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(getAcspFullProfile).not.toHaveBeenCalled();
    });

    it("should fetch ACSP details when not in session", async () => {
        await getAcspProfileMiddleware(req, res, next);

        expect(getAcspFullProfile).toHaveBeenCalledWith(acspNumber);
        expect(next).toHaveBeenCalled();
    });

    it("should fetch ACSP details when not in session and throw an error if status is ceased", async () => {

        (getAcspFullProfile as jest.Mock).mockResolvedValue({ status: "ceased" });

        await getAcspProfileMiddleware(req, res, next);

        expect(getAcspFullProfile).toHaveBeenCalledWith(acspNumber);
        expect(next).toHaveBeenCalledWith(expect.any(AcspCeasedError));
    });

    it("should pass through to next when an error has been caught", async () => {
        const error = new Error("Test error");
        (getAcspFullProfile as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await getAcspProfileMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
