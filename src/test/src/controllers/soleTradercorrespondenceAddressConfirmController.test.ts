import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET /sole-trader/correspondence-address-confirm", () => {
    it("should render the confirmation page with status 200", async () => {
        await router.get("/register-acsp/" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(200);
    });

    it("should render the confirmation page with user data", async () => {
        const userSession = { firstName: "John", lastName: "Doe", correspondenceAddress: "123 Main St" };
        await router
            .get("/register-acsp/" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM)
            .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
            .expect(200);
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /type-of-acsp with status 302", async () => {
        await router.post("/register-acsp/" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).expect(302).expect("Location", "/register-acsp/type-of-acsp");
    });
});
