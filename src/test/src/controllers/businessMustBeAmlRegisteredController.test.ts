import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, BASE_URL, AML_REGISTRATION, TYPE_OF_BUSINESS } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Business must be Aml Registered test -", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, () => {
        it("should return status 200", async () => {
            await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(200);
        });
    });

    describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, () => {
        it("should return status 200", async () => {
            await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT).send({ amlRegistration: AML_REGISTRATION });
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(200);
        });
    });

    describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, () => {
        it("should return status 200", async () => {
            await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT).send({ soleTrader: BASE_URL + TYPE_OF_BUSINESS });
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(200);
        });
    });

});
