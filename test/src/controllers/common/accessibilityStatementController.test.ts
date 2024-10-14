import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, ACCESSIBILITY_STATEMENT } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET" + ACCESSIBILITY_STATEMENT, () => {
    beforeEach(() => {
        createMockSessionMiddleware();
    });

    it("should return status 200 and render the accessibility statement page", async () => {
        const response = await router.get(BASE_URL + ACCESSIBILITY_STATEMENT);

        expect(response.status).toBe(200);
        expect(response.text).toContain("Accessibility statement for the Companies House service");
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
