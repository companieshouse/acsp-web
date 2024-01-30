import supertest from "supertest";
import app from "../../../src/app";
const router = supertest(app);

describe("GET /", () => {
    it("should return status 200", async () => {
        await router.get("/").expect(200);
    });
    describe("POST /type-of-acsp", () => {
        it("should return status 302 after redirect", async () => {
            await router.post("/").expect(302);
        });
    });
});
