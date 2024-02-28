import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("POST /sole-trader/correspondenceAddressAutoLookup", () => {

    describe("POST /sole-trader/correspondence-address-list", () => {
        it("should return status 400 after no radio btn selected", async () => {
            router.post("/register-acsp/sole-trader/correspondence-address-list").send({ correspondenceAddress: "" });
            expect(400);
        });
    });

});
