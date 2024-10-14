import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../src/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { SUBMISSION_ID, USER_DATA } from "../../../src/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

let customMockSessionMiddleware : any;

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {
    describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
        beforeEach(() => {
            createMockSessionMiddleware();
        });

        it("should return status 400 after no radio btn selected", async () => {
            await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });
            expect(400);
        });
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
