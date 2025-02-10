/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_APPLICATION_CONFIRMATION, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("../../../../src/services/transactions/transaction_service");
const router = supertest(app);

describe("GET" + UPDATE_APPLICATION_CONFIRMATION, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Authorised agent update submitted");
    });

    it("should show the technical difficulties page if email address is undefined", async () => {
        const mockSession = {
            getExtraData: jest.fn()
                .mockReturnValueOnce({ email: undefined })
                .mockReturnValueOnce("123456-123456-123456")
        } as unknown as Session;
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = mockSession;
            next();
        });

        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should show technical difficulties page if transactionId is undefined", async () => {
        const mockSession = {
            getExtraData: jest.fn()
                .mockReturnValueOnce({ email: "test@email.com" })
                .mockReturnValueOnce(undefined)
        } as unknown as Session;
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = mockSession;
            next();
        });

        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
