import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_SECTOR_YOU_WORK_IN, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).expect(200);
    });
});

describe("POST" + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessName: "Company"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
    });

    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessName: "Company545-abc"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessName: ""
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessName: "Company@@$%^"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
    });
});
