import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { CONFIRMATION, BASE_URL } from "../../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + CONFIRMATION, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + CONFIRMATION);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Application submitted");
    });
});
