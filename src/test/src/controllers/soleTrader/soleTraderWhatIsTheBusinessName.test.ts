import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../../main/types/pageURL";
import { getAcspRegistration, postAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
jest.mock("../../../../../lib/Logger");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS NAME"
};

describe("GET" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const resp = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        expect(resp.status).toEqual(400);
        expect(resp.text).toContain("Page not found");

    });
});

describe("POST" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Company",
            whatsTheBusinessNameRadio: "A Different Name"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "USERNAME"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: ""
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Select business name");
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "A Different Name"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Enter the business name");
    });

    it("should return status 400 for invalid characters in business name", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Camp<<<<,,,,,",
            whatsTheBusinessNameRadio: "A Different Name"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Business name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    it("should return status 400 for business name length more 200 characters", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            whatsTheBusinessNameRadio: "A Different Name"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Business name must be 200 characters or less");
    });
});