import mocks from "../../../mocks/all_middleware_mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHICH_SECTOR } from "../../../../src/types/pageURL";
import { USER_DATA } from "../../../../src/common/__utils/constants";
import { NextFunction, Request, Response } from "express";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};
let customMockSessionMiddleware: any;

describe("GET " + UNINCORPORATED_WHAT_IS_YOUR_ROLE, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should render what is your role page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const response = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should render what is your role page", async () => {
        const response = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should render what is your role page", async () => {
        const acspData2: AcspData = {
            id: "abc",
            typeOfBusiness: "PARTNERSHIP"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);
        const response = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UNINCORPORATED_WHAT_IS_YOUR_ROLE, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + STOP_NOT_RELEVANT_OFFICER + "?lang=en");
    });

    it("should respond with status 302 on form submission", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_PARTNERSHIP"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHICH_SECTOR + "?lang=en");
    });

    it("should respond with status 302 on form submission", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_GOVERNING_BODY"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHICH_SECTOR + "?lang=en");
    });

    it("should respond with status 302 on form submission", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "EQUIVALENT_OF_DIRECTOR"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + UNINCORPORATED_WHICH_SECTOR + "?lang=en");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        createMockSessionMiddleware("PARTNERSHIP");
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a member of the partnership or someone else");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        createMockSessionMiddleware("UNINCORPORATED");
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select your role");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        createMockSessionMiddleware("CORPORATE_BODY");
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select your role");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_PARTNERSHIP"
        });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddleware (typeOfBusiness: string) {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, {
        typeOfBusiness: typeOfBusiness
    });
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
