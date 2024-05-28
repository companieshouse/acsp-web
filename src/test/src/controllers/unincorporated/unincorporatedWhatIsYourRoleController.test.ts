import mocks from "../../../mocks/all_middleware_mock";
import app from "../../../../main/app";
import supertest from "supertest";
import { sessionMiddleware } from "../../../../../src/main/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHICH_SECTOR } from "../../../../main/types/pageURL";
import { USER_DATA } from "../../../../../src/main/common/__utils/constants";
import { NextFunction, Request, Response } from "express";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP"
};
let customMockSessionMiddleware: any;

describe("GET " + UNINCORPORATED_WHAT_IS_YOUR_ROLE, () => {

    it("should render what is your role page", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const response = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role in the business?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Page not found");
    });
});

describe("POST " + UNINCORPORATED_WHAT_IS_YOUR_ROLE, () => {

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "SOMEONE_ELSE"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + STOP_NOT_RELEVANT_OFFICER + "?lang=en");
    });

    it("should respond with status 302 on form submission with sole trader", async () => {
        const response = await router.post(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE).send({
            WhatIsYourRole: "MEMBER_OF_PARTNERSHIP"
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
