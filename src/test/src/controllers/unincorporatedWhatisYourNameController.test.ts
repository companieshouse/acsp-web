import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_NAME } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + UNINCORPORATED_WHAT_IS_YOUR_NAME, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + UNINCORPORATED_WHAT_IS_YOUR_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            "first-name": "John",
            "middle-names": "",
            "last-name": "Doe"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            "first-name": "",
            "middle-names": "",
            "last-name": ""
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);

        expect(response.status).toBe(400);
    });
});
