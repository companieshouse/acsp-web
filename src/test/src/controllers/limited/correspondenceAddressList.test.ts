import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_LIST } from "../../../../main/types/pageURL";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    businessName: "BUSINESS_NAME"
};

describe("GET" + LIMITED_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);

        const res = await router.get(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select the correspondence address");
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + LIMITED_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });
});
