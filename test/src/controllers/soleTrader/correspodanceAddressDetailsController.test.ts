import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../../src/types/pageURL";
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
        lastName: "Doe"
    }
};

describe("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.text).toContain("John Doe");
        expect(res.text).toContain("Select the correspondence address");
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });
    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
    // Test for correct form details entered, will return 302.
    it("should return status 302 and redirect to correspondence address confirm screen", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 302 and redirect to correspondence address confirm screen", async () => {
        const formData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(formData);
        mockPutAcspRegistration.mockResolvedValueOnce(formData);
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
