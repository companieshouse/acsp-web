import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("GET /sole-trader/correspondence-address-confirm", () => {
    it("should render the confirmation page with status 200", async () => {
        await router.get("/sole-trader/correspondence-address-confirm?lang=en").expect(200);
    });

    it("should render the confirmation page with user data", async () => {
        const userSession = { firstName: "John", lastName: "Doe", correspondenceAddress: "123 Main St" };
        await router
            .get("/sole-trader/correspondence-address-confirm?lang=en")
            .set("Cookie", [`userSession=${JSON.stringify(userSession)}`])
            .expect(200);
    });
});

describe("POST /sole-trader/correspondence-address-confirm", () => {
    it("should redirect to /type-of-acsp with status 302", async () => {
        await router.post("/sole-trader/correspondence-address-confirm?lang=en").expect(302).expect("Location", "/type-of-acsp");
    });
});
