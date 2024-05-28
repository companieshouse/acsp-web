import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import * as crypto from "crypto";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST } from "../../../../main/types/pageURL";
import { getAddressFromPostcode } from "../../../../main/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/postcode-lookup-service");

const router = supertest(app);

const mockResponseBodyOfUKAddress1: UKAddress = ({
    premise: "6",
    addressLine1: "123 Main St",
    postTown: "London",
    postcode: "ST63LJ",
    country: "GB-ENG"
});
const mockResponseBodyOfUKAddress2: UKAddress = ({
    premise: "125",
    addressLine1: "125 Main St",
    postTown: "London",
    postcode: "SW1A 1AA",
    country: "GB-ENG"
});

const mockResponseBodyOfUKAddresses: UKAddress[] = [mockResponseBodyOfUKAddress1, mockResponseBodyOfUKAddress2];

const mockGetUKAddressesFromPostcode = getAddressFromPostcode as jest.Mock;

describe("Address Auto look up tests ", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {
        it("should return status 200", async () => {
            await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).expect(200);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });
    });

    describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {

        it("should redirect to address list with status 302 on successful form submission", async () => {
            const formData = {
                postCode: "ST63LJ",
                premise: ""
            };

            mockGetUKAddressesFromPostcode.mockResolvedValueOnce(mockResponseBodyOfUKAddresses);

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
            expect(response.status).toBe(302); // Expect a redirect status code
            expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST + "?lang=en");
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        it("should redirect to confirm page status 302 on successful form submission", async () => {
            const formData = {
                postCode: "ST63LJ",
                premise: "6"
            };
            mockGetUKAddressesFromPostcode.mockResolvedValueOnce(mockResponseBodyOfUKAddresses);

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
            expect(response.status).toBe(302); // Expect a redirect status code
            expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        it("should return status 400 for invalid postcode entered", async () => {
            const formData = {
                postCode: "S6",
                premise: "6"
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });

        it("should return status 400 for no postcode entered", async () => {
            const formData = {
                postCode: "",
                premise: "6"
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });

        it("should return status 400 for no data entered", async () => {
            const formData = {
                postCode: "",
                premise: ""
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });
    });

});

export function generateRandomBytesBase64 (numBytes: number): string {
    return crypto.randomBytes(numBytes).toString("base64");
}
