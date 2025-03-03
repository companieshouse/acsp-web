import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, CANCEL_AN_UPDATE } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";
const router = supertest(app);

describe("GET " + CANCEL_AN_UPDATE, () => {
    it("should redirect to the correct URL", async () => {
        const response = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE);
        expect(response.status).toBe(302);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
