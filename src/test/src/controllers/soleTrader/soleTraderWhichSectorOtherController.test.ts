import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { SOLE_TRADER_WHICH_SECTOR_OTHER, BASE_URL } from "../../../../main/types/pageURL";
import { getAcspRegistration, postAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
jest.mock("../../../../../lib/Logger");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER"
};

describe("GET" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    beforeEach(() => {
        mockGetAcspRegistration.mockClear();
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const resp = await router.get(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER);
        expect(resp.status).toEqual(400);
        expect(resp.text).toContain("Page not found");

    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "ESTATE_AGENTS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_WHICH_SECTOR_OTHER, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER).send({ whichSectorOther: "" }).expect(400);
    });
});
