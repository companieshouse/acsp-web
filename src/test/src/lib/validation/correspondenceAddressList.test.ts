import supertest from "supertest";
import app from "../../../../main/app";
const router = supertest(app);

describe("POST /sole-trader/correspondenceAddressAutoLookup", () => {

    describe("POST /sole-trader/correspondence-address-list", () => {
        it("should return status 400 after no radio btn selected", async () => {
            const response = await router.post("/sole-trader/correspondence-address-list").send({ correspondenceAddress: "" });
            expect(response.status).toBe(400);
            expect(response.text).toContain("Select the correspondence address");
        });
    });

});
