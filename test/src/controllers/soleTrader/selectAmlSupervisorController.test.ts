import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { SOLE_TRADER_SELECT_AML_SUPERVISOR, AML_MEMBERSHIP_NUMBER, BASE_URL } from "../../../../src/types/pageURL";
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
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Doe"
    }
};

describe("GET" + SOLE_TRADER_SELECT_AML_SUPERVISOR, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.text).toContain("Which Anti-Money Laundering (AML) supervisory bodies are you registered with?");
    });

    it("should return status 200", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.text).toContain("Which Anti-Money Laundering (AML) supervisory bodies are you registered with?");
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");

    });
});

describe("POST" + SOLE_TRADER_SELECT_AML_SUPERVISOR, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select all AML supervisory bodies you are registered with");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
