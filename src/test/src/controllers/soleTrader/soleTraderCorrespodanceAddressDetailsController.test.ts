import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../../main/types/pageURL";
import { getAcspRegistration, postAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../../main/services/errorService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
jest.mock("../../../../../lib/Logger");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;

const correspondenceAddress: Address = {
    propertyDetails: "2",
    line1: "DUNCALF STREET",
    town: "STOKE-ON-TRENT",
    country: "England",
    postcode: "ST6 3LJ"
};

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    businessName: "BUSINESS_NAME",
    correspondenceAddress: correspondenceAddress
};

describe("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
    beforeEach(() => {
        mockGetAcspRegistration.mockClear();
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);

        const res = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select the correspondence address");
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const resp = await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST);
        expect(resp.status).toEqual(400);
        expect(resp.text).toContain("Page not found");

    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {

    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });

    it("should return status 400 and render form with errors on validation failure", async () => {
        mockPostAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});