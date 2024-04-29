import mocks from "../../mocks/all_middleware_mock";
import app from "../../../main/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../src/main/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../main/types/pageURL";
import { USER_DATA } from "../../../../src/main/common/__utils/constants";
import { NextFunction, Request, Response } from "express";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);
let customMockSessionMiddleware: any;

describe("Statement Relevant Officer Router", () => {
    it("should render what is your role page", async () => {
        const response = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "SOLE_TRADER");
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "SOLE_TRADER");
    });
    it("should respond with status 302 on form submission with sole trader", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOLE_TRADER"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "SOLE_TRADER");
    });
    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are the sole trader or someone else");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });
});

function createMockSessionMiddleware (businessName: string, typeOfBusiness: string) {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, {
        businessName: businessName,
        typeOfBusiness: typeOfBusiness
    });
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
