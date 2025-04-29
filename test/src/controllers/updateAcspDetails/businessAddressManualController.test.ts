import { Session } from "@companieshouse/node-session-handler";
import mocks from "../../../mocks/all_middleware_mock";
import { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import app from "../../../../src/app";
import { get } from "../../../../src/controllers/features/update-acsp/businessAddressManualController";
import * as localise from "../../../../src/utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_MANUAL } from "../../../../src/types/pageURL";
import { setPaylodForUpdateInProgress } from "../../../../src/services/update-acsp/updateYourDetailsService";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../../src/common/__utils/constants";
jest.mock("../../../../src/services/update-acsp/updateYourDetailsService");
const router = supertest(app);

describe("GET" + UPDATE_BUSINESS_ADDRESS_MANUAL, () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let sessionMock: Partial<Session>;
    beforeEach(() => {
        sessionMock = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
        };

        req = {
            session: sessionMock as Session,
            query: {}
        } as Partial<Request>;

        res = {
            render: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });
    it("should return status 200", async () => {
        await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should populate payload using setPaylodForUpdateInProgress when ACSP_DETAILS_UPDATE_IN_PROGRESS exists", async () => {
        const mockUpdateInProgressDetails = {
            premises: "10",
            addressLine1: "123 Test Street",
            addressLine2: "Suite 5",
            locality: "Test City",
            region: "Test Region",
            country: "United Kingdom",
            postalCode: "SW1A 1AA"
        };

        (req.session!.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                    return mockUpdateInProgressDetails;
                }
            });
        (req.session!.getExtraData as jest.Mock).mockReturnValueOnce(mockUpdateInProgressDetails);
        (setPaylodForUpdateInProgress as jest.Mock).mockReturnValue(mockUpdateInProgressDetails);
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(setPaylodForUpdateInProgress).toHaveBeenCalledWith(req);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                addressPropertyDetails: "10",
                addressLine1: "123 Test Street",
                addressLine2: "Suite 5",
                addressTown: "Test City",
                addressCounty: "Test Region",
                countryInput: "United Kingdom",
                addressPostcode: "SW1A 1AA"
            }
        }));
    });
    it("should return status 200 when applicantDetails is undefined", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + UPDATE_BUSINESS_ADDRESS_MANUAL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for no addressPropertyDetails, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a property name or number");
    });

    // Test for incorrect addressPropertyDetails Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", addressCountry: "lmn", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressPropertyDetails Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must be 200 characters or less");
    });

    // Test for no addressLine1, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an address");
    });

    // Test for incorrect addressLine1 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine1 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must be 50 characters or less");
    });

    // Test for no addressLine2, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressLine2 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressLine2 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must be 50 characters or less");
    });

    // Test for no addressTown, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a city or town");
    });

    // Test for incorrect addressTown Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must only include letters a to z and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressTown Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "AbcdefghijklmnopqrstuvwxaAbcdefghijklmnopqrstuvwxaA", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must be 50 characters or less");
    });

    // Test for no addressCounty, will return 302.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressCounty Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County, state, province or region must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    // Test for incorrect addressCounty Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "AbcdefghijklmnopqrstuvwxAbcdefghijklmnopqrstuvwxaaA", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County or region must be 50 characters or less");
    });

    // Test for no addressCountry, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcd", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect addressCountry Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a country");
    });

    // Test for no addressPostcode, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    // Test for incorrect addressPostcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB@" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });

    // Test for incorrect addressPostcode Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    // Test for submitting the same data.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "11", addressLine1: "Test Street", addressLine2: "", addressTown: "Test Town", addressCounty: "", addressCountry: "England", addressPostcode: "AB1 2CD" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address line 2 if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the city or town if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the county if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the country if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the postcode if it’s changed or cancel the update if you do not need to make any changes");
    });

    // Test for showing error screen
    it("should return status 500 and should show the error page if an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
