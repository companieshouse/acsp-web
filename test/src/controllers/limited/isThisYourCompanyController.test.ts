import mocks from "../../../mocks/all_middleware_mock";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import app from "../../../../src/app";
import supertest from "supertest";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { LIMITED_IS_THIS_YOUR_COMPANY, BASE_URL, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_YOUR_ROLE } from "../../../../src/types/pageURL";
import { NextFunction, Request, Response } from "express";
import { validCompanyProfile, invalidCompanyProfile } from "../../../mocks/company_profile_mock";
import { COMPANY_DETAILS } from "../../../../src/common/__utils/constants";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);
let customMockSessionMiddleware : any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    applicantDetails: {
        firstName: "John",
        middleName: "",
        lastName: "Doe"
    }
};

describe("Limited Company Controller Tests", () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);
    it("should render the view with company details", async () => {
        const res = await router.get(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(res.status).toBe(200);// render company number page
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + LIMITED_IS_THIS_YOUR_COMPANY, () => {
    beforeEach(() => {
        createMockSessionMiddleware("valid");
    });
    it("should redirect to authentication code page for active company", async () => {
        const res = await router.post(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(customMockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toContain(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE);
    });
    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + LIMITED_IS_THIS_YOUR_COMPANY, () => {
    beforeEach(() => {
        createMockSessionMiddleware("invalid");
    });
    it("should redirect to inactive company page", async () => {
        const res = await router.post(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(customMockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toContain(BASE_URL + LIMITED_COMPANY_INACTIVE);
    });
});

function createMockSessionMiddleware (companyStatus: string) {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    if (companyStatus === "Active") {
        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            session.setExtraData(COMPANY_DETAILS, validCompanyProfile);
            req.session = session;
            next();
        });
    } else if (companyStatus === "invalid") {
        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            session.setExtraData(COMPANY_DETAILS, invalidCompanyProfile);
            req.session = session;
            next();
        });
    }
}
