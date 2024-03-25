import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, LIMITED_WHAT_IS_YOUR_ROLE } from "../../../main/types/pageURL";
import mocks from "../../mocks/all_middleware_mock";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Statement Relevant Officer Router", () => {
    it("should render what is your role page", async () => {
        const response = await router.get(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should respond with status 302 on form submission with sole trader", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_LLP"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });

});
