import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    businessName: "Test Business",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Enter the correspondence address");
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Enter the correspondence address");
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, () => {

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for no addressPropertyDetails, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a property name or number");
    });

    // Test for incorrect addressPropertyDetails Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressPropertyDetails Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must be 200 characters or less");
    });

    // Test for no addressLine1, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an address");
    });

    // Test for incorrect addressLine1 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine1 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must be 50 characters or less");
    });

    // Test for no addressLine2, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressLine2 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine2 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must be 50 characters or less");
    });

    // Test for no addressTown, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a city or town");
    });

    // Test for incorrect addressTown Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must only include letters a to z and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressTown Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxgA", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must be 50 characters or less");
    });

    // Test for no addressCounty, will return 302.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressCounty Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County, state, province or region must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressCounty Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxvA", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County or region must be 50 characters or less");
    });

    // Test for no countryInput, will return 400.
    it("should return status 302", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a country");
    });

    // Test for countryInput not in country list, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "Eng", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a country");
    });

    // Test for no addressPostcode, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "England", addressPostcode: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    // Test for incorrect UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB@" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });

    // Test for incorrect UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GBB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    // Test for incorrect non-UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "Ireland", addressPostcode: "abc$123" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });

    // Test for incorrect non-UK Postcode Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "Ireland", addressPostcode: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must be 15 characters or less");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
