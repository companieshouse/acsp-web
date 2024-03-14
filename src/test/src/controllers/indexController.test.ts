import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL } from "../../../main/types/pageURL";
const router = supertest(app);

describe("Home Page tests -", () => {

    describe("GET /register-acsp/home", () => {
        it("should return status 200", async () => {
            await router.get("/register-acsp/home");
            expect(200);
        });
    });

});
