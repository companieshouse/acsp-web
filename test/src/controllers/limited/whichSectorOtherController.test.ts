import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { LIMITED_WHICH_SECTOR_OTHER, BASE_URL, LIMITED_WHAT_IS_YOUR_EMAIL } from "../../../../src/types/pageURL";
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

describe("GET" + LIMITED_WHICH_SECTOR_OTHER, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 when acspData is undefined", async () => {
        await router.get(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 with applicantDetails", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        await router.get(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_WHICH_SECTOR_OTHER);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_WHICH_SECTOR_OTHER, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "EA" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const formData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            workSector: "AIP"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(formData);
        mockPutAcspRegistration.mockResolvedValueOnce(formData);
        const res = await router.post(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "AIP" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after no radio selected", async () => {
        const res = await router.post(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which sector you work in or if you prefer not to say");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_WHICH_SECTOR_OTHER).send({ whichSectorOther: "EA" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
