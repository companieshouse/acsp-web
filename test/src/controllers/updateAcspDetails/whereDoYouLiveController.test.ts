/* eslint-disable import/first */
jest.mock("@companieshouse/api-sdk-node");
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_YOUR_ANSWERS, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_WHERE_DO_YOU_LIVE } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import { mockSoleTraderAcspFullProfile } from "../../../mocks/update_your_details.mock";
import * as localise from "../../../../src/utils/localise";

const router = supertest(app);

describe("GET" + UPDATE_ACSP_WHAT_IS_YOUR_NAME, () => {
    it("should return status 200", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Where do you live?");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_WHERE_DO_YOU_LIVE, () => {
    it("should return status 302 after redirect", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ACSP_DETAILS, {});
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "Wales" });
        expect(res.status).toBe(302);
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");

    });

    // Test for case insensitive country input
    it("should return status 302 for valid countryInput", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "GERMANY" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });

    // Test for invalid input
    it("should return status 400 for invalid countryInput", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "invalidCountry" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for invalid input
    it("should return status 400 for empty countryInput", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for empty input
    it("should handle countryInput for empty whereDoYouLiveRadio", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "", countryInput: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for empty input
    it("should handle countryInput for users outside the UK", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "", countryInput: "Canada" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
