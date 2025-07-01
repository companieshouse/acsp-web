import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../src/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../src/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });

    describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should return status 400 after no radio btn selected", async () => {
            await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });
            expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
            expect(400);
        });
    });

});
