import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST } from "../../../main/types/pageURL";
jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select the correspondence address");
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });
});
