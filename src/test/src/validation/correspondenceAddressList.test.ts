import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {

    describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, () => {
        it("should return status 400 after no radio btn selected", async () => {
            router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).send({ correspondenceAddress: "" });
            expect(400);
        });
    });

});
