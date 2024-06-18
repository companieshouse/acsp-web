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
    propertyDetails: "2",
    line1: "DUNCALF STREET",
    town: "STOKE-ON-TRENT",
    country: "England",
    postcode: "ST6 3LJ"
};
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS_NAME",
    correspondenceAddress: correspondenceAddress
};

describe("GET" + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {

    mockGetAcspRegistration.mockResolvedValueOnce(acspData);

    it("should render the confirmation page with status 200", async () => {
        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should render the confirmation page with user data", async () => {
        const userSession = { businessName: "Abc", correspondenceAddress: "123 Main St" };
        await router
            .get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM)
            .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
            .expect(200);
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /select-aml-supervisor with status 302", async () => {
        await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM).expect(302).expect("Location", BASE_URL + LIMITED_SECTOR_YOU_WORK_IN + "?lang=en");
    });
});
