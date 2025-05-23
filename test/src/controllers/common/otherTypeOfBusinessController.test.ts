import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { deleteAcspApplication, getAcspRegistration, postAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { BASE_URL, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../../src/types/pageURL";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import { validTransaction } from "../../../mocks/transaction_mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
const router = supertest(app);

let customMockSessionMiddleware : any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
const mockDeleteAcspApplication = deleteAcspApplication as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "OTHER"
};

describe("GET " + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What other type of business are you registering?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST for acspData != null" + OTHER_TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddlewareNotNullUserData();
    });

    // Test for calling PUT endpoint if acspData is not null.
    it("should return status 302 after calling PUT endpoint", async () => {
        mockPutAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(0);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    // Test for calling creating a new transaction if selected option does not match saved option.
    it("should return status 302 after creating new transaction", async () => {
        mockDeleteAcspApplication.mockResolvedValueOnce({ status: 204 });
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "CORPORATE_BODY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    // Test for calling PUT endpoint and failing
    it("should return status 500 after calling PUT endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" });
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST for acspData = null" + OTHER_TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddlewareNullUserData();
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
    });
    // Test for calling POST endpoint if acspData is null.
    it("should return status 302 after calling POST endpoint", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "CORPORATE_BODY" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the type of business you are registering");
    });

    // Test for calling POST endpoint and failing
    it("should return status 500 after calling POST and failing", async () => {
        mockPostAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddlewareNullUserData () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, undefined);
    session.setExtraData(SUBMISSION_ID, undefined);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}

function createMockSessionMiddlewareNotNullUserData () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, { typeOfBusiness: "UNINCORPORATED_ENTITY" });
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
