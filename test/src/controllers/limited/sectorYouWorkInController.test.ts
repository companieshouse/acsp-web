import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { LIMITED_SECTOR_YOU_WORK_IN, BASE_URL, LIMITED_SELECT_AML_SUPERVISOR, LIMITED_WHICH_SECTOR_OTHER } from "../../../../src/types/pageURL";
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
    workSector: "AIA",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("GET" + LIMITED_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);

        await router.get(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        const acspData2: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);

        await router.get(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_SECTOR_YOU_WORK_IN, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AIA" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "OTHER" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHICH_SECTOR_OTHER + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const formData = {
            sectorYouWorkIn: "OTHER",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHICH_SECTOR_OTHER + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const formData = {
            sectorYouWorkIn: "OTHER",
            typeOfBusiness: "LIMITED"
        };
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHICH_SECTOR_OTHER + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which sector you work in");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AIA" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
