import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("POST" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });
});

describe("POST" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: " " }).expect(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "NI5981260987654321" }).expect(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
