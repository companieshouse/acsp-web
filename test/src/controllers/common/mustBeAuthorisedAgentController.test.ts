import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import { BASE_URL, MUST_BE_AUTHORISED_AGENT } from "../../../../src/types/pageURL";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";

const router = supertest(app);

describe("GET " + MUST_BE_AUTHORISED_AGENT, () => {
    it("should return status 200 and display the information on the screen", async () => {
        const res = await router.get(BASE_URL + MUST_BE_AUTHORISED_AGENT);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("You need to be added to an authorised agent account to view this page");
    });

    it("should return status 500 if an error occurs", async () => {
        jest.spyOn(localise, "getLocalesService").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(BASE_URL + MUST_BE_AUTHORISED_AGENT);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
