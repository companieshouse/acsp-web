import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import {
    BASE_URL, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS
} from "../../../../src/types/pageURL";
import { getAddressFromPostcode } from "../../../../src/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/postcode-lookup-service.ts");
jest.mock("../../../../src/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const correspondenceAddress: Address = {
    premises: "2",
    postalCode: "ST6 3LJ"
};

const acspData: AcspData = {
    id: "abc",
    applicantDetails: {
        firstName: "JOHN",
        lastName: "DOE",
        correspondenceAddress: correspondenceAddress
    }
};

const mockResponseBodyOfUKAddress: UKAddress[] = [{
    premise: "2",
    addressLine1: "DUNCALF STREET",
    postTown: "STOKE-ON-TRENT",
    postcode: "ST6 3LJ",
    country: "GB-ENG"
}];

describe("Correspondence address auto look up tests", () => {
    it("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, async () => {
        mockGetAcspRegistration.mockResolvedValueOnce({});
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {

    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE",
                correspondenceAddress: correspondenceAddress
            }
        };
        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        mockPutAcspRegistration.mockResolvedValueOnce(acspData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE",
                correspondenceAddress: correspondenceAddress
            }
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE",
                correspondenceAddress: correspondenceAddress
            }
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2"
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE",
                correspondenceAddress: correspondenceAddress
            }
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: "",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE"
            }
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no postcode found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: "",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE"
            }
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("Postcode not found"));

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find this postcode. Enter a different one, or enter the address manually");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const formData = {
            postCode: "ST63LJ",
            premise: "2",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE"
            }
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should handle a case where an invalid premise is entered", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "Invalid premise",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE"
            }
        };

        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("Invalid premise"));

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
    });

    it("should validate and ensure all fields are correctly handled", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2",
            applicantDetails: {
                firstName: "JOHN",
                lastName: "DOE"
            }
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
});
