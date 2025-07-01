import mocks from "../../../mocks/all_middleware_mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { BASE_URL, LIMITED_WHAT_IS_YOUR_ROLE, STOP_NOT_RELEVANT_OFFICER, LIMITED_NAME_REGISTERED_WITH_AML } from "../../../../src/types/pageURL";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";
import { NextFunction, Request, Response } from "express";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);
let customMockSessionMiddleware: any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    businessName: "business Limited",
    roleType: "director",
    companyDetails: {
        companyNumber: "00006400",
        companyName: "Company Name"
    }
};

describe("GET " + LIMITED_WHAT_IS_YOUR_ROLE, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should render what is your role page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const response = await router.get(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
describe("POST " + LIMITED_WHAT_IS_YOUR_ROLE + "LC", () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LC");
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "DIRECTOR"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const formData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "business Limited",
            roleType: "director",
            companyDetails: {
                companyNumber: "00006400",
                companyName: "Company Name"
            }
        };
        mockGetAcspRegistration.mockResolvedValueOnce(formData);
        mockPutAcspRegistration.mockResolvedValueOnce(formData);
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({ WhatIsYourRole: "DIRECTOR" });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + STOP_NOT_RELEVANT_OFFICER + "?lang=en");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error Putting data"));
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "DIRECTOR"
        });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a director or someone else");
    });

});

describe("POST " + LIMITED_WHAT_IS_YOUR_ROLE + "LP", () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LP");
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "GENERAL_PARTNER"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a general partner or someone else");
    });

});

describe("POST " + LIMITED_WHAT_IS_YOUR_ROLE + "LLP", () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LLP");
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_LLP"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a member of the partnership or someone else");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

function createMockSessionMiddleware (businessName: string, typeOfBusiness: string) {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, {
        businessName: businessName,
        typeOfBusiness: typeOfBusiness
    });
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
