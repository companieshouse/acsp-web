import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, SOLE_TRADER_SELECT_AML_SUPERVISOR } from "../../../main/types/pageURL";
import { getAddressFromPostcode } from "../../../main/services/postcode-lookup-service";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/postcode-lookup-service");

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

describe("Address Confirm tests ", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
        it("should render the confirmation page with status 200", async () => {
            await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(200);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        it("should render the confirmation page with user data", async () => {
            const userSession = { firstName: "John", lastName: "Doe", correspondenceAddress: "123 Main St" };
            await router
                .get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM)
                .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
                .expect(200);
        });
    });

    describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
        it("should redirect to /type-of-acsp with status 302", async () => {
            await router.post(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(302).expect("Location", BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR + "?lang=en");
        });
    });

});
