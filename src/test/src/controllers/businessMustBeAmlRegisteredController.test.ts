import supertest from "supertest";
import app from "../../../main/app";
import { LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, BASE_URL, AML_REGISTRATION, SOLE_TRADER_TYPE_OF_BUSINESS } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED).expect(200);
    });
});

describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED).send({ amlRegistration: AML_REGISTRATION }).expect(200);
    });
});

describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED).send({ soleTrader: BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS }).expect(200);
    });
});
