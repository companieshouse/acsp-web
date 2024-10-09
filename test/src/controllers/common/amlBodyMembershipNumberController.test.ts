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
    typeOfBusiness: "LIMITED",
    businessName: "Business",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("GET " + AML_MEMBERSHIP_NUMBER, () => {
    it("should render the AML membership number page with status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });

    it("should render the AML membership number page with status 200", async () => {
        const acspData2: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);
        const res = await router.get(BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + AML_MEMBERSHIP_NUMBER, () => {
    const formData = {
        membershipNumber_1: "ABC",
        membershipNumber_2: "CBA",
        membershipNumber__3: "Finance",
        sectorYouWorkIn: "AIA",
        typeOfBusiness: "SOLE_TRADER",
        applicantDetails: {
            firstName: "John",
            middleName: "",
            lastName: "Doe"
        }
    };
    it("should return status 302 after redirect for valid input, ", async () => {
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send(formData);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + AML_BODY_DETAILS_CONFIRM + "?lang=en");
    });

    it("should return status 400 for invalid input, empty value", async () => {
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: " " });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
        expect(res.text).toContain("Enter the details for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 400 for invalid input, value is more than 256 characters", async () => {
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: "yHwml8BPxLQ5LoQeH5ScYkEEHe00NBIZO1j13EbozE9O7i2HJcTgKH4F97if95K6kptRglWGmzidTDTlRJAQcvx266KlEGtOQk8PTQ902oUpo0CxLDOBz7gQksTRKXLhYOB6cGgVikR7OARmY5n5xcGFbsNXyb26VzOz5HRCqs4lbGuWzw3Jmlf9R4y9NCAUttTic2YUCYvCijoibqtiHL5ZZr096PBmOIIUf9tYbpoXU5PE1N2eRTIO8xzLIUDZo" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
        expect(res.text).toContain("The Anti-Money Laundering (AML) membership number must be 256 characters or less for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 500 after calling POST endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send(formData);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
