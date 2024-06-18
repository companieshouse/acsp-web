import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST } from "../../../../src/types/pageURL";
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
    businessName: "Test Business"
};

describe("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Test Business");
        expect(res.text).toContain("Select the correspondence address");
    });
    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, () => {
    // Test for correct form details entered, will return 302.
    it("should return status 302 and redirect to correspondence address confirm screen", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
