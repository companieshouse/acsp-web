import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";
import { Request, Response, NextFunction } from "express";

import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, UNINCORPORATED_WHAT_IS_YOUR_EMAIL } from "../../../../src/types/pageURL";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

let customMockSessionMiddleware : any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    businessName: "Test Business",
    applicantDetails: {
        correspondenceAddress: {
            premises: "Property Details"
        }
    }
};

describe("GET" + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
    it("should render the confirmation page with status 200 ans display the information on the screen", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
        expect(res.text).toContain("Property Details");
        expect(res.text).toContain("Test Business");
    });

    it("should return status 200 when applicantDetails is undefined", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Confirm the correspondence address");
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /select-aml-supervisor with status 302", async () => {
        const acspDataDifferentCorrespondenAndRegisteredAddress: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {}
            },
            registeredOfficeAddress: {
                postalCode: "ST6 3LJ"
            }
        };
        createMockSessionMiddleware(acspDataDifferentCorrespondenAndRegisteredAddress);
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });
    it("should redirect to /select-aml-supervisor with status 302", async () => {
        const acspDataSameCorrespondenAndRegisteredAddress: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            businessName: "Business",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    postalCode: "ST6 3LJ"
                }
            },
            registeredOfficeAddress: {
                postalCode: "ST6 3LJ"
            }
        };
        createMockSessionMiddleware(acspDataSameCorrespondenAndRegisteredAddress);
        const res = await router.post(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });
});

function createMockSessionMiddleware (acspData: AcspData) {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(USER_DATA, acspData);
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
