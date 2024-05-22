import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../main/types/pageURL";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";


jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    workSector: "AUDITORS_INSOLVENCY_PRACTITIONERS"
};

describe("GET" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for no addressPropertyDetails, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Enter a property name or number");
    });
});

// Test for incorrect addressPropertyDetails Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400 with error message for incorrect addressPropertyDetails format", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", addressCountry: "lmn", addressPostcode: "MK9 3GB" });
        expect(res.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
});

// Test for incorrect addressPropertyDetails Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Property name or number must be 200 characters or less");
    });
});

// Test for no addressLine1, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Enter an address");
    });
});
// Test for incorrect addressLine1 Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
});
// Test for incorrect addressLine1 Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Address line 1 must be 50 characters or less");
    });
});

// Test for no addressLine2, will return 302.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 302", async () => {
        await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect addressLine2 Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
});
// Test for incorrect addressLine2 Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Address line 2 must be 50 characters or less");
    });
});

// Test for no addressTown, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Enter a city or town");
    });
});
// Test for incorrect addressTown Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("City or town must only include letters a to z and common special characters such as hyphens, spaces and apostrophes");
    });
});
// Test for incorrect addressTown Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "AbcdefghijklmnopqrstuvwxutAbcdefghijklmnopqrstuvwxwA", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("City or town must be 50 characters or less");
    });
});

// Test for no addressCounty, will return 302.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect addressCounty Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("County or region must only include letters a to z");
    });
});
// Test for incorrect addressCounty Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "AbcdefghijklmnopqrstuvwxbbAbcdefghijklmnopqrstuvwxaaa", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("County or region must be 50 characters or less");
    });
});

// Test for no addressCountry, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Enter a country");
    });
});

// Test for incorrect addressCountry Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmno@", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Country must only include letters a to z");
    });
});
// Test for incorrect addressCountry Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "AbcdefghijklmnopqrstuvwxbbAbcdefghijklmnopqrstuvwxaaa", addressPostcode: "MK9 3GB" }).expect(400);
        expect(res.text).toContain("Country must be 50 characters or less");
    });
});

// Test for no addressPostcode, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "" }).expect(400);
        expect(res.text).toContain("Enter a postcode");
    });
});
// Test for incorrect addressPostcode Format entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB@" }).expect(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });
});
// Test for incorrect addressPostcode Length entered, will return 400.
describe("POST" + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A3GB" }).expect(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });
});
