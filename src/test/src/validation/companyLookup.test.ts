import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = { 
    id : "abc",
    typeOfBusiness: "LIMITED"
 }

describe("get" + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);
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
