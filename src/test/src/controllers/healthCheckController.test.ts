import app from "../../../main/app";
import supertest from "supertest";

const router = supertest(app);

describe("GET /healthcheck", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/").expect(200);
    });
});
