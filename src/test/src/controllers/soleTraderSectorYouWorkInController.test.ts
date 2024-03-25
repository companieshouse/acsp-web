import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_SECTOR_YOU_WORK_IN } from "../../../main/types/pageURL";
import mocks from "../../mocks/all_middleware_mock";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "" }).expect(400);
    });
});
