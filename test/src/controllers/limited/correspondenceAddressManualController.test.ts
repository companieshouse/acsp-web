import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    workSector: "AUDITORS_INSOLVENCY_PRACTITIONERS"
};

describe("GET" + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, () => {

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for no addressPropertyDetails, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a property name or number");
    });

    // Test for incorrect addressPropertyDetails Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", addressCountry: "lmn", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressPropertyDetails Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must be 200 characters or less");
    });

    // Test for no addressLine1, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an address");
    });

    // Test for incorrect addressLine1 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine1 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must be 50 characters or less");
    });

    // Test for no addressLine2, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressLine2 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine2 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must be 50 characters or less");
    });

    // Test for no addressTown, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a city or town");
    });

    // Test for incorrect addressTown Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must only include letters a to z and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressTown Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxgA", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must be 50 characters or less");
    });

    // Test for no addressCounty, will return 302.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressCounty Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County or region must only include letters a to z and spaces");
    });

    // Test for incorrect addressCounty Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxvA", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County or region must be 50 characters or less");
    });

    // Test for no addressCountry, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcd", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressCountry Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmno@", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Country must only include letters a to z and spaces");
    });

    // Test for incorrect addressCountry Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "AbcdefghijklmnopqrstuvwxaAbcdefghijklmnopqrstuvwxwA", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Country must be 50 characters or less");
    });

    // Test for no addressPostcode, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    // Test for incorrect addressPostcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB@" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });

    // Test for incorrect addressPostcode Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
