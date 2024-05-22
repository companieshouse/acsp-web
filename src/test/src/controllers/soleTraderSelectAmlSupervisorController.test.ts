import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_SELECT_AML_SUPERVISOR, AML_MEMBERSHIP_NUMBER, BASE_URL } from "../../../main/types/pageURL";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER"
};

describe("GET" + SOLE_TRADER_SELECT_AML_SUPERVISOR, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Which Anti-Money Laundering (AML) supervisory bodies are you registered with?");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_SELECT_AML_SUPERVISOR, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_SELECT_AML_SUPERVISOR, () => {
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select all AML supervisory bodies you are registered with");
    });
});

