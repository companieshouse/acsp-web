import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, () => {
    it("should return status 200", async () => {
        await router.get(SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED).expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED).send({ howAreYouAmlSupervised: "NAME_OF_THE_BUSINESS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED).send({ howAreYouAmlSupervised: "" }).expect(400);
    });
});
