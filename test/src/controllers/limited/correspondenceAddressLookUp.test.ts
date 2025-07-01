import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_LIST, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP } from "../../../../src/types/pageURL";
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
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS NAME",
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Doe",
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

describe("GET" + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return 200 and render the page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 200 when acspData is undefined", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce({});
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            postCode: "ST63LJ",
            premise: "2",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    postalCode: "ST6 3LJ",
                    premises: "2"
                }
            }
        };
        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2"
        };

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no country found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("correspondenceLookUpAddressWithoutCountry"));

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find the full address from the postcode. Enter the address manually");
    });
    it("should return status 400 for no postcode found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("Postcode not found"));

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find this postcode. Enter a different one, or enter the address manually");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
