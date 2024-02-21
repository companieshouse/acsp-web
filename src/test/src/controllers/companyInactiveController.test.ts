import supertest from "supertest";
import app from "../../../main/app";
import { LIMITED_COMPANY_INACTIVE, BASE_URL } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + LIMITED_COMPANY_INACTIVE, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_COMPANY_INACTIVE).expect(200);
    });
});
