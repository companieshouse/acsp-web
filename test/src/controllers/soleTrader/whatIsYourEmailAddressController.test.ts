import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, SOLE_TRADER_SELECT_AML_SUPERVISOR, SOLE_TRADER_WHAT_IS_YOUR_EMAIL } from "../../../../src/types/pageURL";
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
    workSector: "AIP"
};

describe("GET" + SOLE_TRADER_WHAT_IS_YOUR_EMAIL, () => {

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What email address should we use for correspondence?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_EMAIL, () => {

    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const formData = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "test@email.com"
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const formData = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: ""
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an email address");
    });

    it("should return status 400 after incorrect data entered", async () => {
        const formData = {
            whatIsYourEmailRadio: "",
            whatIsYourEmailInput: ""
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an email address");
    });

    it("should return status 400 after incorrect data entered", async () => {
        const formData = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "test"
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter an email address in the correct format, like name@example.com");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        const formData = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "test@email.com"
        };
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
