import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_LIST } from "../../../../src/types/pageURL";

const router = supertest(app);

describe("GET" + UPDATE_BUSINESS_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Choose an address");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_BUSINESS_ADDRESS_LIST, () => {
    it("should redirect to next page with status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST).send({ businessAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 after no data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST).send({ businessAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the business address");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST).send({ businessAddress: "1" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
