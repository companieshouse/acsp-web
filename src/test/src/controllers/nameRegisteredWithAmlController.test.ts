import supertest from "supertest";
import app from "../../../main/app";
import { LIMITED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).expect(200);
    });
});

// Test when radio btn selected, will return 302 after redirecting to the next page.
describe("POST" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" }).expect(302);
    });
});
// Test for no radio btn value selected, will return 400.
describe("POST" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "" }).expect(400);
    });
});
