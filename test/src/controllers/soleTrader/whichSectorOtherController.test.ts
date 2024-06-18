import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { SOLE_TRADER_WHICH_SECTOR_OTHER, BASE_URL } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED"
};

describe("GET" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "ESTATE_AGENTS" }).expect(302);
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "" }).expect(400);
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "ESTATE_AGENTS" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
