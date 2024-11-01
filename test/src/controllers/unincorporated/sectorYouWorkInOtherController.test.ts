import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UNINCORPORATED_WHICH_SECTOR_OTHER, BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP"
};

describe("GET" + UNINCORPORATED_WHICH_SECTOR_OTHER, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Which other sector do you work in?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + UNINCORPORATED_WHICH_SECTOR_OTHER, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "EA" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after no radio selected", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which sector you work in or if you prefer not to say");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "EA" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
