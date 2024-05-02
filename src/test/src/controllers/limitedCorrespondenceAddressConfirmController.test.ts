import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, LIMITED_SECTOR_YOU_WORK_IN } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
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
