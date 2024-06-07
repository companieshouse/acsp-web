import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";

import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_ROLE } from "../../../../main/types/pageURL";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP"
};

describe("GET" + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What is the name of the business?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessName: "Company"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);
        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE + "?lang=en");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            whatIsTheBusinessName: ""
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(response.text).toContain("Enter the business name");
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessName: "Company@@$%^"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Business name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    it("should return status 400 for busines name too long", async () => {
        const formData = {
            whatIsTheBusinessName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME).send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Business name must be 200 characters or less");
    });
});
