import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, BASE_URL } from "../../../main/types/pageURL";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";


jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    workSector: "AUDITORS_INSOLVENCY_PRACTITIONERS"
};

describe("GET" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);

        await router.get(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "" }).expect(400);
    });
});
