import { NextFunction, Request, Response } from "express";
import { companyAuthenticationMiddleware } from "../../../src/main/middleware/company_authentication_middleware";

jest.mock("../../../src/main/middleware/company_authentication_middleware");

// get handle on mocked function
const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;

// tell the mock what to return
mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockCompanyAuthenticationMiddleware;
