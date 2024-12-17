import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, HOME_URL, UPDATE_YOUR_ANSWERS, ACSP_DETAILS_UPDATE_CONFIRMATION } from "../../../../src/types/pageURL";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;

const acspDataSoleTrader: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLC: AcspData = {
    id: "abc",
    typeOfBusiness: "LC",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLLP: AcspData = {
    id: "abc",
    typeOfBusiness: "LLP",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataCorporateBody: AcspData = {
    id: "abc",
    typeOfBusiness: "CORPORATE_BODY",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataPartnership: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataUnincorporated: AcspData = {
    id: "abc",
    typeOfBusiness: "UNINCORPORATED",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
const acspDataLp: AcspData = {
    id: "abc",
    typeOfBusiness: "LP",
    amlSupervisoryBodies: [{
        amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
        membershipId: "12345678"
    }],
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};
describe("GET " + HOME_URL, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataSoleTrader);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLC);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLLP);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataCorporateBody);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataPartnership);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataUnincorporated);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataLp);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should return status 500 after calling getAcspRegistration endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + HOME_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + ACSP_DETAILS_UPDATE_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
