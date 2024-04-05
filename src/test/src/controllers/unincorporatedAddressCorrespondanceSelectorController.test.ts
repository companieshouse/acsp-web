import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, BASE_URL, UNINCORPORATED_SELECT_AML_SUPERVISOR, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../main/types/pageURL";
import { Address } from "../../../main/model/Address";


jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with status 200", async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
});

describe("POST " + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with validation errors", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });



    it("should redirect to correspondence-address-lookup page when address option is CORRESPONDANCE_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "CORRESPONDANCE_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR + "?lang=en");
    });
 

    it("should redirect to correspondence-address-lookup page when address option is DIFFERENT_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "DIFFERENT_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP + "?lang=en");
    });
});


