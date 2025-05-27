import { Request, Response, NextFunction } from "express";
import * as sessionUtils from "../../../../src/common/__utils/session";
import { closeAcspIsOwnerMiddleware } from "../../../../src/middleware/close-acsp/close_acsp_is_owner_middleware";

const getLoggedInAcspRoleSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInAcspRole");

const req: Request = {} as Request;
const res: Response = {} as Response;
const next: NextFunction = jest.fn();

describe("acsp is owner middleware tests", () => {
    it("should throw an error when role is not 'owner'", () => {
        getLoggedInAcspRoleSpy.mockReturnValue("admin");

        expect(() => closeAcspIsOwnerMiddleware(req, res, next)).toThrow("Invalid ACSP role - admin");
    });

    it("should do nothing when role is owner", () => {
        getLoggedInAcspRoleSpy.mockReturnValue("owner");

        closeAcspIsOwnerMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
