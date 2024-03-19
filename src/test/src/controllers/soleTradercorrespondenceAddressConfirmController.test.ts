import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
    xit("should render the confirmation page with status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    xit("should render the confirmation page with user data", async () => {
        const userSession = { firstName: "John", lastName: "Doe", correspondenceAddress: "123 Main St" };
        await router
            .get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM)
            .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
            .expect(200);
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    xit("should redirect to /type-of-acsp with status 302", async () => {
        await router.post(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(302).expect("Location", "/register-as-companies-house-authorised-agent/type-of-acsp");
    });
});
