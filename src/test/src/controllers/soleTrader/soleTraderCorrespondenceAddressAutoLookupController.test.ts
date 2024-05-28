import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import {
    BASE_URL, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS
} from "../../../../main/types/pageURL";
import { getAddressFromPostcode } from "../../../../main/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/postcode-lookup-service.ts");
jest.mock("../../../../main/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const correspondenceAddress: Address = {
    propertyDetails: "2",
    line1: "DUNCALF STREET",
    postcode: "ST6 3LJ"
};

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    businessName: "BUSINESS NAME",
    correspondenceAddress: correspondenceAddress
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
});

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {

    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST + "?lang=en");
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
            premise: "2"
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });
});
