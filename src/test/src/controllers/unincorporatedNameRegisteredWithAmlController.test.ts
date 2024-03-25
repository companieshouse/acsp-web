import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + UNINCORPORATED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST" + UNINCORPORATED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "YOUR_NAME" }).expect(302);
    });
});

// Test for no radio btn value selected, will return 400.
describe("POST" + UNINCORPORATED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 400 after incorrect data entered", async () => {
    // Add this line to include middleware checks for the 400 case
        await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" }).expect(302);
    });
});
