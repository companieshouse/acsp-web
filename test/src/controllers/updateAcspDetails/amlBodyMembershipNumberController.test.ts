import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

describe("GET " + AML_MEMBERSHIP_NUMBER, () => {
    it("should render the AML membership number page with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, () => {
    it("should return status 302 after redirect for valid input, ", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });

    it("should return status 400 for invalid input, empty value", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: " " });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
        expect(res.text).toContain("Enter the details for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 400 for invalid input, value is more than 256 characters", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: "yHwml8BPxLQ5LoQeH5ScYkEEHe00NBIZO1j13EbozE9O7i2HJcTgKH4F97if95K6kptRglWGmzidTDTlRJAQcvx266KlEGtOQk8PTQ902oUpo0CxLDOBz7gQksTRKXLhYOB6cGgVikR7OARmY5n5xcGFbsNXyb26VzOz5HRCqs4lbGuWzw3Jmlf9R4y9NCAUttTic2YUCYvCijoibqtiHL5ZZr096PBmOIIUf9tYbpoXU5PE1N2eRTIO8xzLIUDZo" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
        expect(res.text).toContain("The Anti-Money Laundering (AML) membership number must be 256 characters or less for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 500 after calling POST endpoint and failing", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
