import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../main/types/pageURL";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData, Nationality } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    countryOfResidence: "Wales"
};

describe("GET" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form with valid inputs, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    it("should return status 302 after redirect", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "Wales" });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "fewrfw" }).expect(400);
    });
});

// Test for empty input
describe("POST" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    it("should fail validation with empty first nationality", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: " " }).expect(400);
    });
});
