import mockAuthenticationMiddleware from "../../mocks/authentication_middleware_mock";
import mockSessionMiddleware from "../../mocks/session_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { BASE_URL, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).expect(200);
        expect(mockSessionMiddleware).toHaveBeenCalled();
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessName: "Company"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mockSessionMiddleware).toHaveBeenCalled();
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessName: "Company545-&abc. "
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mockSessionMiddleware).toHaveBeenCalled();
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessName: ""
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mockSessionMiddleware).toHaveBeenCalled();
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessName: "Company@@$%^"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mockSessionMiddleware).toHaveBeenCalled();
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
