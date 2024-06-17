import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, AML_MEMBERSHIP_NUMBER, AML_BODY_DETAILS_CONFIRM } from "../../../../src/types/pageURL";
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

describe("GET " + AML_MEMBERSHIP_NUMBER, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);

    it("should render the AML membership number page with status 200", async () => {
        const res = await router.get(BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });
});

describe("POST" + AML_MEMBERSHIP_NUMBER, () => {
    it("Test for valid input, should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "ABC", membershipNumber_2: "CBA", membershipNumber__3: "Finance" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + AML_BODY_DETAILS_CONFIRM + "?lang=en");
    });

    it("Test for invalid input , empty value - should return status 400", async () => {
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: " " });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
        expect(res.text).toContain("Enter the details for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 500 after calling POST endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "ABC", membershipNumber_2: "CBA", membershipNumber__3: "Finance" });
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
