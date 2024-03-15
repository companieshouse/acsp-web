import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("CompanyLookupController", () => {
    test("GET" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, async () => {
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER);
        expect(res.status).toBe(200);// render company number page
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });
});

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: " " }).expect(400);
    });
});

// describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
//     it("should return status 400 after redirect", async () => {
//         await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
//             .send({ companyNumber: "08694860" }).expect(400);
//     });
// });

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
    });
});

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "NI5981260987654321" }).expect(400);
    });
});

/* test("POST" + LIMITED_COMPANY_NUMBER, async () => {
    const res = await router
        .post(BASE_URL + LIMITED_COMPANY_NUMBER)
        .send({ companyNumber: "NI038379" });

    expect(res.status).toBe(302);
}, 1000);// Redirect status code - valid company number */
