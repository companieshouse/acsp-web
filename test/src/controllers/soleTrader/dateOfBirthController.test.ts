import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../../src/types/pageURL";
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
        lastName: "Doe"
    }
};

describe("GET" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    beforeEach(() => {
        mockGetAcspRegistration.mockClear();
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.text).toContain("What is your date of birth?");
    });

    it("should return status 200 when acspData is undefined", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce({});
        const res = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.text).toContain("What is your date of birth?");
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);

        const res = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What is your date of birth?");
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    beforeEach(() => {
        mockPutAcspRegistration.mockClear();
    });

    it("should return status 302 after redirect", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const sendData = {
            "dob-year": "1999",
            "dob-month": "02",
            "dob-day": "11"
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send(sendData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY + "?lang=en");
    });

    it("should return status 400 for invalid date", async () => {
        const sendData = {
            "dob-year": "1999",
            "dob-month": "02",
            "dob-day": "30" // Invalid date
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send(sendData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Date of birth must be a real date");
    });

    it("should return status 400 for empty fields", async () => {
        const sendData = {
            "dob-year": "",
            "dob-month": "",
            "dob-day": ""
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send(sendData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter your date of birth");
    });

    it("should handle missing applicantDetails in POST", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);

        const sendData = {
            "dob-year": "1999",
            "dob-month": "02",
            "dob-day": "11"
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send(sendData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY + "?lang=en");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const sendData = {
            "dob-year": "1999",
            "dob-month": "02",
            "dob-day": "11"
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send(sendData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
