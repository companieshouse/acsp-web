import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("GET /sole-trader/name", () => {
    it("should return status 200", async () => {
        await router.get("/sole-trader/name").expect(200);
    });
});

describe("POST /sole-trader/name", () => {
    it("should redirect with status 302 on successful form submission", async () => {
        const formData = {
            "first-name": "John",
            "middle-names": "",
            "last-name": "Doe"
        };

        const response = await router.post("/sole-trader/name").send(formData);

        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe("/sole-trader/date-of-birth");
    });

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            "first-name": "",
            "middle-names": "",
            "last-name": ""
        };

        const response = await router.post("/sole-trader/name").send(formData);

        expect(response.status).toBe(400);
    });
});
