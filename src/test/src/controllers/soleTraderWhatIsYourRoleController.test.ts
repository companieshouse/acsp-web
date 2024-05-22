import mocks from "../../mocks/all_middleware_mock";
import app from "../../../main/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../src/main/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../main/types/pageURL";
import { USER_DATA } from "../../../../src/main/common/__utils/constants";
import { NextFunction, Request, Response } from "express";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
const router = supertest(app);
let customMockSessionMiddleware: any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    workSector: "AUDITORS_INSOLVENCY_PRACTITIONERS"
};

describe("Statement Relevant Officer Router", () => {
    it("should render what is your role page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const response = await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LIMITED_PARTNERSHIP");
    });
    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LIMITED_PARTNERSHIP");
    });

    it("should respond with status 302 on form submission with sole trader", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_LLP"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LIMITED_PARTNERSHIP");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a general partner or someone else");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LIMITED_COMPANY");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: ""
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select if you are a director or someone else");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

});

describe("POST " + SOLE_TRADER_WHAT_IS_YOUR_ROLE, () => {
    beforeEach(() => {
        createMockSessionMiddleware("Example Business", "LIMITED_LIABILITY_PARTNERSHIP");
    });

    it("should respond with status 400 on form submission with empty role", async () => {
        const response = await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE).send({
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
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
