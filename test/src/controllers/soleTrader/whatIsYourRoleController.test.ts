import mocks from "../../../mocks/all_middleware_mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_ROLE, STOP_NOT_RELEVANT_OFFICER } from "../../../../src/types/pageURL";
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
    workSector: "AIP",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("Statement Relevant Officer Router", () => {

    it("should render what is your role page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const response = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should render what is your role page", async () => {
        const response = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("SOLE_TRADER");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + STOP_NOT_RELEVANT_OFFICER + "?lang=en");
    });

    it("should respond with status 302 on form submission with sole trader", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOLE_TRADER"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME + "?lang=en");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are the sole trader or someone else");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOLE_TRADER"
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
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
