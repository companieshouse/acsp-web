import app from "../../../../main/app";
import supertest from "supertest";
import { HEALTHCHECK, BASE_URL } from "../../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + HEALTHCHECK, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + HEALTHCHECK).expect(200);
    });
});
