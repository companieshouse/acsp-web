import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_NAME } from "../../../../main/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP"
};

describe("GET" + UNINCORPORATED_WHAT_IS_YOUR_NAME, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What is your name?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
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
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME + "?lang=en");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            "first-name": "",
            "middle-names": "",
            "last-name": ""
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Enter your full name");
    });

    it("should return status 400 for no first name entered", async () => {
        const formData = {
            "first-name": "",
            "middle-names": "",
            "last-name": "Doe"
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Enter your first name");
    });

    it("should return status 400 for no last name entered", async () => {
        const formData = {
            "first-name": "John",
            "middle-names": "",
            "last-name": ""
        };

        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Enter your last name");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const formData = {
            "first-name": "John",
            "middle-names": "",
            "last-name": "Doe"
        };

        const res = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
