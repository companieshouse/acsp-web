import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_SECTOR_YOU_WORK_IN } from "../../../../src/types/pageURL";
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
        lastName: "Doe",
        correspondenceAddress: {
            postalCode: "ST6 3LJ"
        }
    }
};

describe("GET " + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 200 when acspData is undefined", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce({});
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 200 when correspondence address is undefined", async () => {
        const acspDataWithoutCorrespondenAddress: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutCorrespondenAddress);
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with validation errors", async () => {
        const res = await router
            .post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should render the correspondence address selector page with validation errors", async () => {
        const formData = {
            typeOfBusiness: "SOLE_TRADER",
            addressSelectorRadio: "",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe",
                correspondenceAddress: {
                    postalCode: "ST6 3LJ"
                }
            }
        };
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should render the correspondence address selector page with validation errors", async () => {
        const acspData2 = {
            id: "abc",
            typeOfBusiness: "SOLE_TRADER"
        };
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS).send(acspData2);
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router
            .post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "DIFFERENT_ADDRESS" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should redirect to sector-you-work-in page when address option is correspondance Address and postcodes are the same", async () => {
        const formData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            registeredOfficeAddress: { postalCode: "AB1 2CD" },
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: { postalCode: "AB1 2CD" }
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(formData);
        mockPutAcspRegistration.mockResolvedValueOnce(formData);
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS).send({ addressSelectorRadio: "CORRESPONDANCE_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN + "?lang=en");
    });

    it("should redirect to address look up page when address option is Different Address and postcodes are the same", async () => {
        const returnedAcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            registeredOfficeAddress: { postalCode: "AB1 2CD" },
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: { postalCode: "HP1 2PD" }
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(returnedAcspData);
        mockPutAcspRegistration.mockResolvedValueOnce(returnedAcspData);
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS).send({ addressSelectorRadio: "DIFFERENT_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP + "?lang=en");
    });
});
