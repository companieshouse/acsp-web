import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { SOLE_TRADER_WHICH_SECTOR_OTHER, BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../../src/types/pageURL";
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
        lastName: "Doe"
    }
};

describe("GET" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    const formData = {
        whichSectorOther: "EA",
        sectorYouWorkIn: "AIP",
        typeOfBusiness: "SOLE_TRADER",
        applicantDetails: {
            firstName: "John",
            middleName: "",
            lastName: "Doe"
        }
    };
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after no radio selected", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which sector you work in or if you prefer not to say");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
