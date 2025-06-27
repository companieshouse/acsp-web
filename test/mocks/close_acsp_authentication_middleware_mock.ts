import { NextFunction, Request, Response } from "express";
import { closeAcspAuthMiddleware } from "../../src/middleware/close-acsp/close_acsp_authentication_middleware";
import { closeAcspBaseAuthenticationMiddleware } from "../../src/middleware/close-acsp/close_acsp_base_authentication_middleware";
import { closeAcspIsOwnerMiddleware } from "../../src/middleware/close-acsp/close_acsp_is_owner_middleware";
import { closeAcspUserIsPartOfAcspMiddleware } from "../../src/middleware/close-acsp/close_acsp_user_is_part_of_acsp_middleware";

jest.mock("../../src/middleware/close-acsp/close_acsp_authentication_middleware");
jest.mock("../../src/middleware/close-acsp/close_acsp_base_authentication_middleware");
jest.mock("../../src/middleware/close-acsp/close_acsp_is_owner_middleware");
jest.mock("../../src/middleware/close-acsp/close_acsp_user_is_part_of_acsp_middleware");

// get handle on mocked function
const mockCloseAcspAuthenticationMiddleware = closeAcspAuthMiddleware as jest.Mock;
const mockCloseAcspBaseAuthenticationMiddleware = closeAcspBaseAuthenticationMiddleware as jest.Mock;
const mockCloseAcspIsOwnerMiddleware = closeAcspIsOwnerMiddleware as jest.Mock;
const mockCloseAcspUserIsPartOfAcspMiddleware = closeAcspUserIsPartOfAcspMiddleware as jest.Mock;

// tell the mock what to return
mockCloseAcspAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockCloseAcspBaseAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockCloseAcspIsOwnerMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockCloseAcspUserIsPartOfAcspMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default {
    mockCloseAcspAuthenticationMiddleware,
    mockCloseAcspBaseAuthenticationMiddleware,
    mockCloseAcspIsOwnerMiddleware,
    mockCloseAcspUserIsPartOfAcspMiddleware
};
