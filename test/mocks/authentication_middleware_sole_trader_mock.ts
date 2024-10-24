import { NextFunction, Request, Response } from "express";
import { authenticationMiddlewareForSoleTrader } from "../../src/middleware/authentication_middleware_sole_trader";
jest.mock("../../src/middleware/authentication_middleware_sole_trader");

// get handle on mocked function
const mockAuthenticationMiddlewareForSoleTrader = authenticationMiddlewareForSoleTrader as jest.Mock;

// tell the mock what to return
mockAuthenticationMiddlewareForSoleTrader.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockAuthenticationMiddlewareForSoleTrader;
