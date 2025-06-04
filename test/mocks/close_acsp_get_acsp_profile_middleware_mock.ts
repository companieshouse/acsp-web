import { Request, Response, NextFunction } from "express";
import { getAcspProfileMiddleware } from "../../src/middleware/close-acsp/close_acsp_get_acsp_profile_middleware";

jest.mock("../../src/middleware/close-acsp/close_acsp_get_acsp_profile_middleware");

const mockGetAcspProfileMiddleware = getAcspProfileMiddleware as jest.Mock;

mockGetAcspProfileMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockGetAcspProfileMiddleware;
