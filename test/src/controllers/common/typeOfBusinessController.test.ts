import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { TYPE_OF_BUSINESS, BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../../src/types/pageURL";
import { getAcspRegistration, postAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
const router = supertest(app);

let customMockSessionMiddleware : any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED"
};

const acspDataUnIncorporated: AcspData = {
    id: "unincorporated",
    typeOfBusiness: "UNINCORPORATED"
};

const acspDataCorporateBody: AcspData = {
    id: "corporatebody",
    typeOfBusiness: "CORPORATE_BODY"
};

describe("GET " + TYPE_OF_BUSINESS, () => {

    it("should return status for the 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS)
            .set("Custom-Header", BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataUnIncorporated);
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataCorporateBody);
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "PARTNERSHIP" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "SOLE_TRADER" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "OTHER" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + OTHER_TYPE_OF_BUSINESS + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select what type of business are you registering");
    });

    // Test for calling PUT endpoint if acspData is not null.
    it("should return status 302 after calling PUT endpoint", async () => {
        mockPutAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(0);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    // Test for calling PUT endpoint failure.
    it("should return status 500 after calling PUT endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("GET for SUBMISSION_ID = null" + TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddleware();
    });
    it("should return status 200 and create a transaction", async () => {
        mockPostTransaction.mockResolvedValueOnce({ id: "12345" });
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, undefined);
    session.setExtraData(SUBMISSION_ID, undefined);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
