import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { LIMITED_SECTOR_YOU_WORK_IN, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + LIMITED_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + LIMITED_SECTOR_YOU_WORK_IN, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + LIMITED_SECTOR_YOU_WORK_IN, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "" }).expect(400);
    });
});
