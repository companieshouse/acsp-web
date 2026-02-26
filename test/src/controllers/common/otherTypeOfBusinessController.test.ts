import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { deleteAcspApplication, getAcspRegistration, postAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { BASE_URL, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../../src/types/pageURL";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { SUBMISSION_ID, TYPE_OF_BUSINESS_SELECTED, USER_DATA } from "../../../../src/common/__utils/constants";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { getSavedApplication, postTransaction } from "../../../../src/services/transactions/transaction_service";
import { validTransaction } from "../../../mocks/transaction_mock";
import { getRedirectionUrl } from "../../../../src/services/checkSavedApplicationService";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { TYPE_OF_BUSINESS } from "../../../../src/config";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/checkSavedApplicationService");
const router = supertest(app);

let customMockSessionMiddleware: any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
const mockDeleteAcspApplication = deleteAcspApplication as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;
const mockGetSavedApplication = getSavedApplication as jest.Mock;
const mockGetRedirectionUrl = getRedirectionUrl as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "OTHER"
};

const hasSavedApplication: Resource<TransactionList> = {
    httpStatusCode: 200
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

    it("should redirect to the URL returned by getRedirectionUrl if not resume application", async () => {
        createMockSessionMiddlewareResumeApplicationUndefined();
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        const mockRedirectionUrl = BASE_URL + TYPE_OF_BUSINESS;
        mockGetRedirectionUrl.mockResolvedValueOnce(mockRedirectionUrl);

        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(res.status).toBe(302);
        expect(res.header.location).toContain(mockRedirectionUrl);
    });

    it("should render the other business type page if getRedirectionUrl returns undefined", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        mockGetRedirectionUrl.mockResolvedValueOnce(undefined);

        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What other type of business are you registering?");
    });

    it("should render the other business type page if TYPE_OF_BUSINESS_SELECTED is true", async () => {
        createMockSessionMiddlewareTypeOfBusinessSelectedTrue();
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        mockGetRedirectionUrl.mockResolvedValueOnce(BASE_URL + TYPE_OF_BUSINESS);

        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What other type of business are you registering?");
    });

    it("should render the other business type page if getSavedApplication returns undefined", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(undefined);
        mockGetRedirectionUrl.mockResolvedValueOnce(undefined);

        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What other type of business are you registering?");
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

function createMockSessionMiddlewareResumeApplicationUndefined () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData("resume_application", undefined);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}

function createMockSessionMiddlewareTypeOfBusinessSelectedTrue () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(TYPE_OF_BUSINESS_SELECTED, true);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
