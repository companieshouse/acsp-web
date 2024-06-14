import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM } from "../../../../main/types/pageURL";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration, putAcspRegistration } from "../../../../main/services/acspRegistrationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    businessName: "Test Business"
};

describe("GET" + UNINCORPORATED_BUSINESS_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Choose an address");
        expect(res.text).toContain("Test Business");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UNINCORPORATED_BUSINESS_ADDRESS_LIST, () => {

    it("should return status 302 and redirect to confirm correspondence address screen", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST).send({ businessAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });
    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST).send({ businessAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the business address");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST).send({ businessAddress: "1" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
