import app from "../../../main/app";
import supertest from "supertest";

const router = supertest(app);

describe("GET /healthcheck", () => {
    xit("should return status 200", async () => {
        await router.get("/register-acsp/healthcheck").expect(200);
    });
});
