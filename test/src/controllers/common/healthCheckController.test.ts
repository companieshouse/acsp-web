import mocks from "../../../mocks/all_middleware_mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { HEALTHCHECK, BASE_URL } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET" + HEALTHCHECK, () => {

    it("should return status 200", async () => {
        await router.get(BASE_URL + HEALTHCHECK).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(0);
    });
});
