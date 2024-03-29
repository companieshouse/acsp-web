import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, BASE_URL, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, () => {
    it("should render the confirmation page with status 200", async () => {
        await router.get(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should render the confirmation page with user data", async () => {
        const userSession = { firstName: "John", lastName: "Doe", correspondenceAddress: "123 Main St" };
        await router
            .get(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM)
            .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
            .expect(200);
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /type-of-acsp with status 302", async () => {
        await router.post(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM).expect(302).expect("Location", BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
    });
});
