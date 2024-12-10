import { NextFunction, Request, Response } from "express";
import { updateAcspAuthMiddleware } from "../../src/middleware/update_acsp_authentication_middleware";

jest.mock("../../src/middleware/update_acsp_authentication_middleware");

// get handle on mocked function
const mockAcspAuthenticationMiddleware = updateAcspAuthMiddleware as jest.Mock;

// tell the mock what to return
mockAcspAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockAcspAuthenticationMiddleware;
