import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_WHICH_SECTOR_OTHER } from "../../../../src/types/pageURL";
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

describe("GET" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");

    });
});

describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const formData = {
            sectorYouWorkIn: "AIA",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS + "?lang=en");
    });

    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const formData = {
            sectorYouWorkIn: "OTHER",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const formData = {
            sectorYouWorkIn: "",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };
        const res = await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which sector you work in");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        const formData = {
            sectorYouWorkIn: "AIA",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
