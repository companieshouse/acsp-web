import { NextFunction, Request, Response } from "express";
import { updateAcspAuthMiddleware } from "../../src/middleware/update-acsp/update_acsp_authentication_middleware";
import { updateAcspBaseAuthenticationMiddleware } from "../../src/middleware/update-acsp/update_acsp_base_authentication_middleware";
import { updateAcspIsOwnerMiddleware } from "../../src/middleware/update-acsp/update_acsp_is_owner_middleware";
import { updateAcspUserIsPartOfAcspMiddleware } from "../../src/middleware/update-acsp/update_acsp_user_is_part_of_acsp_middleware";

jest.mock("../../src/middleware/update-acsp/update_acsp_authentication_middleware");
jest.mock("../../src/middleware/update-acsp/update_acsp_base_authentication_middleware");
jest.mock("../../src/middleware/update-acsp/update_acsp_is_owner_middleware");
jest.mock("../../src/middleware/update-acsp/update_acsp_user_is_part_of_acsp_middleware")

// get handle on mocked function
const mockUpdateAcspAuthenticationMiddleware = updateAcspAuthMiddleware as jest.Mock;
const mockUpdateAcspBaseAuthenticationMiddleware = updateAcspBaseAuthenticationMiddleware as jest.Mock;
const mockUpdateAcspIsOwnerMiddleware = updateAcspIsOwnerMiddleware as jest.Mock;
const mockUpdateAcspUserIsPartOfAcspMiddleware = updateAcspUserIsPartOfAcspMiddleware as jest.Mock;

// tell the mock what to return
mockUpdateAcspAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockUpdateAcspBaseAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockUpdateAcspIsOwnerMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());
mockUpdateAcspUserIsPartOfAcspMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default {
    mockUpdateAcspAuthenticationMiddleware,
    mockUpdateAcspBaseAuthenticationMiddleware,
    mockUpdateAcspIsOwnerMiddleware,
    mockUpdateAcspUserIsPartOfAcspMiddleware
};
