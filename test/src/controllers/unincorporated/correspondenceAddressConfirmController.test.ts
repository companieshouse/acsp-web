import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";

import { UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, UNINCORPORATED_SELECT_AML_SUPERVISOR } from "../../../../src/types/pageURL";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    businessName: "Test Business",
    correspondenceAddress: {
        propertyDetails: "Property Details"
    }
};

describe("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
    it("should render the confirmation page with status 200 ans display the information on the screen", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
        expect(res.text).toContain("Property Details");
        expect(res.text).toContain("Test Business");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /select-aml-supervisor with status 302", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR + "?lang=en");
    });
});
