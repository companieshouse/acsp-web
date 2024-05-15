import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { BASE_URL, CHECK_YOUR_ANSWERS, CONFIRMATION } from "../../../main/types/pageURL";
import { closeTransaction } from "../../../main/services/transactions/transaction_service";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/transactions/transaction_service");
const router = supertest(app);

const mockCloseTransaction = closeTransaction as jest.Mock;

describe("GET" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Check your answers before sending your application");
    });
});

describe("POST" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 302 after redirect to confirmation page", async () => {
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);

        mockCloseTransaction.mockRejectedValueOnce("");

        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + CONFIRMATION + "?lang=en");
    });
});
