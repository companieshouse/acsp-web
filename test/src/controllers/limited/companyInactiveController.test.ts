import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";

import { LIMITED_COMPANY_INACTIVE, BASE_URL } from "../../../../src/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + LIMITED_COMPANY_INACTIVE, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_COMPANY_INACTIVE).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
