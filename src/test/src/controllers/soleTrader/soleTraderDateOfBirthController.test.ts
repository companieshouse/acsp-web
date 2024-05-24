import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH } from "../../../../main/types/pageURL";
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
    firstName: "John",
    middleName: "",
    lastName: "Doe"
};
describe("GET" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    beforeEach(() => {
        mockGetAcspRegistration.mockClear();
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const resp = await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(resp.status).toEqual(400);
        expect(resp.text).toContain("Page not found");

    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    it("should return status 302 after redirect", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH)
            .send({
                "dob-year": "1999",
                "dob-month": "02",
                "dob-day": "11"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    it("should return status 400", async () => {
        mockPostAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        expect(res.status).toBe(400);
    });
});
