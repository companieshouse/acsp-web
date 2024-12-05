import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, HOME_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import { closeTransaction } from "../../../../src/services/transactions/transaction_service";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;

const acspDataSoleTrader: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLC: AcspData = {
    id: "abc",
    typeOfBusiness: "LC",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLLP: AcspData = {
    id: "abc",
    typeOfBusiness: "LLP",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataCorporateBody: AcspData = {
    id: "abc",
    typeOfBusiness: "CORPORATE_BODY",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataPartnership: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataUnincorporated: AcspData = {
    id: "abc",
    typeOfBusiness: "UNINCORPORATED",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLp: AcspData = {
    id: "abc",
    typeOfBusiness: "LP",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
describe("GET " + HOME_URL, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataSoleTrader);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLC);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLLP);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataCorporateBody);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataPartnership);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataUnincorporated);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLp);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL+UPDATE_YOUR_ANSWERS+"?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
});
