import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData, Nationality } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;

const nationalityData: Nationality = {
    firstNationality: "British",
    secondNationality: "",
    thirdNationality: ""
};

const acspData: AcspData = {
    id: "abc",
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        nationality: nationalityData
    }
};

describe("GET" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is your nationality?");
    });

    it("should return status 200", async () => {
        const acspData2: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });


    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");

    });
});

// Test for correct form with valid inputs, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 302 after redirect", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "French", nationality_input_2: "German" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE + "?lang=en");
    });
});

// Test for correct form with valid input only first input populated, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "", nationality_input_2: "" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE + "?lang=en");
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "fewrfw", nationality_input_1: "rwerf", nationality_input_2: "pqfrgr" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a nationality from the list");
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "rgwaet", nationality_input_1: "British", nationality_input_2: "erjfg" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a nationality from the list");
    });
});

// Test for  invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "ergverb", nationality_input_1: "erbetb", nationality_input_2: "British" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a nationality from the list");
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "erbetb", nationality_input_2: "gjscjqechk" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a nationality from the list");
    });
});

// Test for empty input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with empty first nationality", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: " ", nationality_input_1: " ", nationality_input_2: " " });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter your nationality");
    });
});

// Test for same inputs
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with same inputs", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "British", nationality_input_2: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a different second nationality");
    });
});

// Test for same inputs
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with same inputs", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "American", nationality_input_2: "British" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a different third nationality");
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with invalid nationality", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: " ", nationality_input_2: "Italian" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a nationality from the list");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "French", nationality_input_2: "German" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
