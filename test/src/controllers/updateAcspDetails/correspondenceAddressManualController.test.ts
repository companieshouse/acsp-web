import { Session } from "@companieshouse/node-session-handler";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_MANUAL } from "../../../../src/types/pageURL";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS, SUBMISSION_ID } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { Request, Response, NextFunction } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { get } from "../../../../src/controllers/features/update-acsp/correspondenceAddressManualController";

jest.mock("../../../../src/services/update-acsp/updateYourDetailsService");
jest.mock("../../../../src/services/correspondence-address/correspondence-address-manual");

const router = supertest(app);

describe("GET" + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, () => {
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
        await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL).expect(200);
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

        const mockAcspUpdatedFullProfile = {
            type: "sole-trader",
            registeredOfficeAddress: {
                postalCode: "AB1 2CD",
                premises: "20"
            }
        };

        (req.session!.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                    return mockUpdateInProgressDetails;
                }
                if (key === ACSP_DETAILS_UPDATED) {
                    return mockAcspUpdatedFullProfile;
                }
                return null;
            });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
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
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, () => {

    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
    // Test for uppercase country name, will return 302.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "ENGLAND", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
    // Test for no addressPropertyDetails, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a property name or number");
    });
    // Test for incorrect addressPropertyDetails Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
    // Test for incorrect addressPropertyDetails Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Property name or number must be 200 characters or less");
    });
    // Test for no addressLine1, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an address");
    });
    // Test for incorrect addressLine1 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
    // Test for incorrect addressLine1 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", countryInput: "England", addressCountry: "lmnop", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 1 must be 50 characters or less");
    });
    // Test for no addressLine2, will return 302.
    it("should return status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
    // Test for incorrect addressLine2 Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
    // Test for incorrect addressLine2 Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Address line 2 must be 50 characters or less");
    });
    // Test for no addressTown, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a city or town");
    });
    // Test for incorrect addressTown Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must only include letters a to z and common special characters such as hyphens, spaces and apostrophes");
    });
    // Test for incorrect addressTown Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxgA", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("City or town must be 50 characters or less");
    });
    // Test for no addressCounty, will return 302.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
    // Test for incorrect addressCounty Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County, state, province or region must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });
    // Test for incorrect addressCounty Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "AbcdefghijklmnopqrstuvwxdAbcdefghijklmnopqrstuvwxvA", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("County or region must be 50 characters or less");
    });
    // Test for no addressCountry, will return 400.
    it("should return status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a country");
    });
    // Test for country not in list entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "Eng", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select a country");
    });
    // Test for no addressPostcode, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "England", addressPostcode: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });
    // Test for incorrect non-UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", countryInput: "Ireland", addressPostcode: "MK93GB@" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });
    // Test for incorrect non-UK Postcode Length entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "Ireland", addressPostcode: "abcdefghijklmnop" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must be 15 characters or less");
    });
    // Test for incorrect UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "England", addressPostcode: "MK9 3GB@" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Postcode must only include letters a to z, numbers and spaces");
    });
    // Test for incorrect UK Postcode Format entered, will return 400.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "England", addressPostcode: "MK9 3GBB" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });
    // Test for error renders the error screen.
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", countryInput: "", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    // Test for submitting the same data.
    it("should return status 400", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "11", addressLine1: "Test Street", addressLine2: "Test Line 2", addressTown: "Test Town", addressCounty: "Region", countryInput: "England", addressPostcode: "AB12CD" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address line 2 if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the city or town if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the county if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the country if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the postcode if it’s changed or cancel the update if you do not need to make any changes");
    });
});

let customMockSessionMiddleware: any;

describe("GET" + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, () => {

    it("should return status 200 with sole-trader type", async () => {
        createMockSessionMiddleware();
        await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, () => {

    it("should return status 302 after redirect with sole-trader type", async () => {
        createMockSessionMiddleware();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", countryInput: "England", addressPostcode: "MK9 3GB" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for submitting the same data.
    it("should return status 400", async () => {
        createMockSessionMiddleware();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL)
            .send({ addressPropertyDetails: "11", addressLine1: "Test Street", addressLine2: "", addressTown: "Test Town", addressCounty: "", countryInput: "England", addressPostcode: "AB1 2CD" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the address line 2 if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the city or town if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the county if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the country if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update the postcode if it’s changed or cancel the update if you do not need to make any changes");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, type: "sole-trader" });
    session.setExtraData(ACSP_DETAILS, { ...dummyFullProfile, type: "sole-trader" });
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
