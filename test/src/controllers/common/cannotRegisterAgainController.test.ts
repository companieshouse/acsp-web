import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, CANNOT_REGISTER_AGAIN } from "../../../../src/types/pageURL";

const router = supertest(app);

describe("GET " + CANNOT_REGISTER_AGAIN, () => {
    it("should respond with status 200", async () => {
        const res = await router.get(BASE_URL + CANNOT_REGISTER_AGAIN);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Can not register again as the application is already approved");
    });
});
