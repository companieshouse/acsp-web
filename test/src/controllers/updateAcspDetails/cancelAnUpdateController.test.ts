import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, CANCEL_AN_UPDATE } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + CANCEL_AN_UPDATE, () => {
    it("should redirect to the correct URL", async () => {
        const response = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE);
        expect(response.status).toBe(302);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });
});
