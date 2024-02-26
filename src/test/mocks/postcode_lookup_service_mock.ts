import { NextFunction, Request, Response } from "express";
import { getUKAddressesFromPostcode } from "../../../src/main/services/postcode-lookup-service";

jest.mock("../../../src/main/middleware/authentication_middleware");

const mockUKAddressesFromPostcode = getUKAddressesFromPostcode as jest.Mock;

mockUKAddressesFromPostcode.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockUKAddressesFromPostcode;
