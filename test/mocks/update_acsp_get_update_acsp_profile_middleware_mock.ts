import { Request, Response, NextFunction } from "express";
import { getUpdateAcspProfileMiddleware } from "../../src/middleware/update-acsp/update_acsp_get_acsp_profile_middleware";

jest.mock("../../src/middleware/update-acsp/update_acsp_get_acsp_profile_middleware");

const mockGetUpdateAcspProfileMiddleware = getUpdateAcspProfileMiddleware as jest.Mock;

mockGetUpdateAcspProfileMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockGetUpdateAcspProfileMiddleware;
