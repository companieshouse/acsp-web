import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_ROLE, STOP_NOT_RELEVANT_OFFICER } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Statement Relevant Officer Router", () => {
    it("should render statement-relevant-officer page", async () => {
        const response = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role?");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        // expect(response.header.location).toBe(BASE_URL + STOP_NOT_RELEVANT_OFFICER);
    });

    /* it("should respond with status 400 on form submission with invalid role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "DIRECTOR"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        //expect(response.text).toContain("Status code: 404");
    }); */
});
