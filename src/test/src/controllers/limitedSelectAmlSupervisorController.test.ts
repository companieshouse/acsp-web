import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { LIMITED_SELECT_AML_SUPERVISOR, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + LIMITED_SELECT_AML_SUPERVISOR, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + LIMITED_SELECT_AML_SUPERVISOR, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" }).expect(302);
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + LIMITED_SELECT_AML_SUPERVISOR, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" }).expect(400);
    });
});
