import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST } from "../../../main/types/pageURL";
jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" }).expect(400);
    });
});
