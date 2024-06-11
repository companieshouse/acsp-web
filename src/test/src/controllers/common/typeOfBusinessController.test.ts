import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { TYPE_OF_BUSINESS, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../../main/types/pageURL";
import { getAcspRegistration, postAcspRegistration, putAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { sessionMiddleware } from "../../../../main/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Request, Response, NextFunction } from "express";
import { USER_DATA } from "../../../../main/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

let customMockSessionMiddleware : any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED"
};
describe("GET " + TYPE_OF_BUSINESS, () => {

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What type of business are you registering?");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" });
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
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(0);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    // Test for calling PUT endpoint failure.
    it("should return status 500 after calling PUT endpoint and failing", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" });
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST for acspData = null" + TYPE_OF_BUSINESS, () => {
    beforeEach(() => {
        createMockSessionMiddleware();
    });
    // Test for calling POST endpoint if acspData is null.
    it("should return status 302 after calling POST endpoint", async () => {
        mockPostAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(mockPutAcspRegistration).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER + "?lang=en");
    });

    // Test for calling POST endpoint failure.
    it("should return status 500 after calling POST endpoint and failing", async () => {
        mockPostAcspRegistration.mockRejectedValueOnce(new Error("Error saving data"));
        const res = await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" });
        expect(mockPostAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, undefined);
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
