import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_SECTOR_YOU_WORK_IN } from "../../../main/types/pageURL";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = { 
    id : "abc",
    typeOfBusiness: "LIMITED"
 }

describe("GET " + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
});

describe("POST " + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with validation errors", async () => {
        const res = await router
            .post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should redirect to correspondence-address-lookup page when address option is CORRESPONDANCE_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "CORRESPONDANCE_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN + "?lang=en");
    });

    it("should redirect to correspondence-address-lookup page when address option is DIFFERENT_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "DIFFERENT_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP + "?lang=en");
    });
});
