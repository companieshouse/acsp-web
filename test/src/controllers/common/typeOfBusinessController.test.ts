import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { TYPE_OF_BUSINESS, BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../../src/types/pageURL";
import { deleteAcspApplication, getAcspRegistration, postAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";
import { getSavedApplication, postTransaction } from "../../../../src/services/transactions/transaction_service";
import { validTransaction, transactionId } from "../../../mocks/transaction_mock";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { getRedirectionUrl } from "../../../../src/services/checkSavedApplicationService";
import { SAVED_APPLICATION } from "../../../../src/config";
import jwt, { JwtPayload } from "jsonwebtoken";

let mockPresentersFeatureFlag = "false";
jest.mock("../../../../src/utils/properties", () => ({
    ...jest.requireActual("../../../../src/utils/properties"),
    get FEATURE_FLAG_PRESENTERS_230926 () {
        return mockPresentersFeatureFlag;
    }
}));
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

const hasSavedApplication: Resource<TransactionList> = {
    httpStatusCode: 200
};

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

    it("should redirect to the URL returned by getRedirectionUrl if it is not the business type page", async () => {
        createMockSessionMiddlewareResumeApplicationUndefined();
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        const mockRedirectionUrl = BASE_URL + SAVED_APPLICATION;
        mockGetRedirectionUrl.mockResolvedValueOnce(mockRedirectionUrl);

        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(res.status).toBe(302);
        expect(res.header.location).toContain(mockRedirectionUrl);
    });

    it("should render the business type page if getRedirectionUrl returns undefined", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        mockGetRedirectionUrl.mockResolvedValueOnce(undefined);

        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should render the business type page if getRedirectionUrl returns the business type page URL", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        mockGetRedirectionUrl.mockResolvedValueOnce(BASE_URL + TYPE_OF_BUSINESS);

        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });

    it("should render the business type page if getSavedApplication returns undefined", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(undefined);
        mockGetRedirectionUrl.mockResolvedValueOnce(undefined);

        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST for acsp != null " + TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddlewareNotNullUserData();
    });
    // Test for calling PUT endpoint if acspData is not null and type of business does not change.
    it("should return status 302 after calling PUT endpoint", async () => {
        mockPutAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(0);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    // Test for calling creating a new transaction if selected option does not match saved option.
    it("should return status 302 after creating new transaction", async () => {
        mockDeleteAcspApplication.mockResolvedValueOnce({ status: 204 });
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LP" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    // Test for calling PUT endpoint failure.
    it("should return status 500 after calling PUT endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    // Test for calling creating new transaction failure.
    it("should return status 500 after calling PUT endpoint and failing", async () => {
        mockDeleteAcspApplication.mockRejectedValueOnce(new Error("Error deleting application"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LP" });
        expect(mockDeleteAcspApplication).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST for acspData = null & SUBMISSION_ID = null" + TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddlewareNullUserData();
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
    });
    // Test for calling POST endpoint if acspData is null.
    it("should return status 302 after calling POST endpoint", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "PARTNERSHIP" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
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

    // Test for calling POST endpoint failure.
    it("should return status 500 after calling POST endpoint and failing", async () => {
        mockPostAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + TYPE_OF_BUSINESS + " with FEATURE_FLAG_PRESENTERS_230926 enabled", () => {
    const CHS_URL = "http://chs.local";
    const presenterUrlPrefix = (id: string): string => `${CHS_URL}/transaction/${id}/presenter?token=`;
    const decodeTokenFromLocation = (location: string): JwtPayload =>
        jwt.verify(new URL(location).searchParams.get("token")!, process.env.CHS_JWT_SECRET!) as JwtPayload;

    beforeEach(() => {
        mockPresentersFeatureFlag = "true";
    });

    afterEach(() => {
        mockPresentersFeatureFlag = "false";
    });

    it.each([
        ["LC", LIMITED_WHAT_IS_THE_COMPANY_NUMBER],
        ["LLP", LIMITED_WHAT_IS_THE_COMPANY_NUMBER],
        ["PARTNERSHIP", UNINCORPORATED_NAME_REGISTERED_WITH_AML],
        ["LP", UNINCORPORATED_NAME_REGISTERED_WITH_AML],
        ["SOLE_TRADER", SOLE_TRADER_WHAT_IS_YOUR_ROLE]
    ])("should redirect to transactions web with a signed token when a new %s application is created", async (selectedOption, nextPage) => {
        createMockSessionMiddlewareNullUserData();
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: selectedOption });
        expect(res.status).toBe(302);
        expect(res.header.location.startsWith(presenterUrlPrefix(transactionId))).toBe(true);
        expect(decodeTokenFromLocation(res.header.location)).toEqual(expect.objectContaining({
            form_type: "ACSP01",
            transaction_id: transactionId,
            return_url: CHS_URL + BASE_URL + nextPage + "?lang=en",
            back_url: CHS_URL + BASE_URL + TYPE_OF_BUSINESS + "?lang=en",
            lang: "en"
        }));
    });

    it("should pass the welsh language to transactions web when lang is cy", async () => {
        createMockSessionMiddlewareNullUserData();
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS + "?lang=cy").send({ typeOfBusinessRadio: "SOLE_TRADER" });
        expect(res.status).toBe(302);
        expect(decodeTokenFromLocation(res.header.location)).toEqual(expect.objectContaining({
            return_url: CHS_URL + BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE + "?lang=cy",
            back_url: CHS_URL + BASE_URL + TYPE_OF_BUSINESS + "?lang=cy",
            lang: "cy"
        }));
    });

    it("should redirect to transactions web when the business type changes and a new application is created", async () => {
        createMockSessionMiddlewareNotNullUserData();
        mockDeleteAcspApplication.mockResolvedValueOnce({ status: 204 });
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LP" });
        expect(res.status).toBe(302);
        expect(res.header.location.startsWith(presenterUrlPrefix(transactionId))).toBe(true);
        expect(decodeTokenFromLocation(res.header.location).transaction_id).toBe(transactionId);
    });

    it("should redirect to transactions web when an existing application is updated", async () => {
        createMockSessionMiddlewareNotNullUserData();
        mockPutAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LC" });
        expect(res.status).toBe(302);
        expect(res.header.location.startsWith(presenterUrlPrefix("transactionID"))).toBe(true);
        expect(decodeTokenFromLocation(res.header.location)).toEqual(expect.objectContaining({
            transaction_id: "transactionID",
            return_url: CHS_URL + BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en"
        }));
    });

    it("should redirect to the other type of business page when OTHER is selected", async () => {
        createMockSessionMiddlewareNullUserData();
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "OTHER" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + OTHER_TYPE_OF_BUSINESS + "?lang=en");
    });
});

describe("POST " + TYPE_OF_BUSINESS + " with FEATURE_FLAG_PRESENTERS_230926 disabled", () => {
    it("should redirect to the next page when a new application is created", async () => {
        createMockSessionMiddlewareNullUserData();
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "SOLE_TRADER" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE + "?lang=en");
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
    session.setExtraData(USER_DATA, { typeOfBusiness: "LC" });
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
