import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Do"
    },
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS NAME"
};

describe("GET" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");

    });
});

describe("POST" + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Company",
            whatsTheBusinessNameRadio: "A Different Name",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should redirect with status 302 on successful form submission with the company name including char +", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Company+Name",
            whatsTheBusinessNameRadio: "A Different Name"
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "USERNAME",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
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
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(response.text).toContain("Select business name");
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "A Different Name",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(response.text).toContain("Enter the business name");
    });

    it("should return status 400 for invalid characters in business name", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Camp<<<<,,,,,",
            whatsTheBusinessNameRadio: "A Different Name",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(response.text).toContain("Business name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    it("should return status 400 for business name length more 155 characters", async () => {
        const formData = {
            // 156 character string to test character length validation
            whatIsTheBusinessNameInput: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            whatsTheBusinessNameRadio: "A Different Name",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);

        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(response.text).toContain("Business name must be 155 characters or less");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const formData = {
            whatIsTheBusinessNameInput: "",
            whatsTheBusinessNameRadio: "USERNAME",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
