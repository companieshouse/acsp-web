import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP } from "../../../main/types/pageURL";
import { getAddressFromPostcode } from "../../../main/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/postcode-lookup-service.ts");

const router = supertest(app);

const mockResponseBodyOfUKAddress: UKAddress[] = [{
    premise: "2",
    addressLine1: "DUNCALF STREET",
    postTown: "STOKE-ON-TRENT",
    postcode: "ST6 3LJ",
    country: "GB-ENG"
}];

describe("Correspondence address auto look up tests", () => {
    it("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
});

describe("POST" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, () => {

    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2"
        };

        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a postcode");
    });
});
