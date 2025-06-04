import { NextFunction, Request, Response } from "express";
import { getSessionRequestWithPermission, acspNumber } from "../../../mocks/session.mock";
import { getAcspProfileMiddleware } from "../../../../src/middleware/close-acsp/close_acsp_get_acsp_profile_middleware";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { createRequest, MockRequest } from "node-mocks-http";
import { Session } from "@companieshouse/node-session-handler";

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

        session.getExtraData = jest.fn();
        session.setExtraData = jest.fn();

        req.session = session;
    });

    it("should call next() when ACSP is active and details exist in session", async () => {
        const session = req.session as any as Session;
        (session.getExtraData as jest.Mock).mockReturnValue({ status: "active" });

        await getAcspProfileMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(getAcspFullProfile).not.toHaveBeenCalled();
    });

    it("should fetch ACSP details when not in session", async () => {
        const session = req.session as any as Session;
        const profile = { status: "active" };
        (getAcspFullProfile as jest.Mock).mockResolvedValue(profile);
        (session.getExtraData as jest.Mock).mockReturnValue(undefined);

        await getAcspProfileMiddleware(req, res, next);

        expect(getAcspFullProfile).toHaveBeenCalledWith(acspNumber);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_DETAILS, profile);
        expect(next).toHaveBeenCalled();
    });

    it("should pass through any caught errors", async () => {
        const session = req.session as any as Session;
        const error = new Error("Test error");
        (getAcspFullProfile as jest.Mock).mockRejectedValue(error);
        (session.getExtraData as jest.Mock).mockReturnValue(undefined);

        await getAcspProfileMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
