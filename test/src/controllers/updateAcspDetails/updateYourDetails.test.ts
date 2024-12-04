import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, HOME_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + HOME_URL, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
});
