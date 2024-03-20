import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL } from "../../../main/types/pageURL";
const router = supertest(app);

describe("Home Page tests -", () => {
"GET " + BASE_URL +
    describe("GET /register-as-companies-house-authorised-agent/home", () => {
        it("should return status 200", async () => {
            await router.get("/register-as-companies-house-authorised-agent/home");
            expect(200);
        });
    });

});
