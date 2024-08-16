import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";

import { LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, LIMITED_SECTOR_YOU_WORK_IN } from "../../../../src/types/pageURL";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const correspondenceAddress: Address = {
    premises: "2",
    addressLine1: "DUNCALF STREET",
    locality: "STOKE-ON-TRENT",
    country: "England",
    postalCode: "ST6 3LJ"
};
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS_NAME",
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        correspondenceAddress: correspondenceAddress
    }
};

describe("GET " + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {

    it("should render the confirmation page with status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {

    it("should redirect to /select-aml-supervisor with status 302", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN + "?lang=en");
    });

    it("should return status 302 with acspData", async () => {
        const formData = {
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                correspondenceAddress: {
                    addressLine1: "2 DUNCALF STREET",
                    locality: "STOKE-ON-TRENT",
                    country: "England",
                    postalCode: "ST6 3LJ"
                }
            }
        };
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM).send(formData);
        expect(res.status).toBe(302);
    });
});
