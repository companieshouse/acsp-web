import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { HEALTHCHECK, BASE_URL } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET" + HEALTHCHECK, () => {
    beforeEach(() => {
        createMockSessionMiddleware();
    });

    it("should return status 200", async () => {
        await router.get(BASE_URL + HEALTHCHECK).expect(200);
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = mocks.mockSessionMiddleware;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, undefined);
    session.setExtraData(SUBMISSION_ID, undefined);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
