import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_EMAIL } from "../../../../src/types/pageURL";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { Request, Response, NextFunction } from "express";

import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { SUBMISSION_ID, USER_DATA } from "../../../../src/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

let customMockSessionMiddleware: any;

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe",
        correspondenceAddress: {
            premises: "Property Details",
            addressLine1: "123 Test St",
            addressLine2: "",
            locality: "Test",
            region: "Test",
            country: "Test",
            postalCode: "TE5 5TL"
        }
    },
    registeredOfficeAddress: {
        postalCode: "TE5 5TL"
    }
};

describe("GET" + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, () => {
    it("should render the confirmation page with status 200 ans display the information on the screen", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("John Doe");
        expect(res.text).toContain("Confirm the correspondence address");
        expect(res.text).toContain("Property Details");
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });

    it("should render the confirmation page with status 200 without applicantDetails", async () => {
        const acspDataWithoutApplicantDetails: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspDataWithoutApplicantDetails);
        const res = await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
    it("should redirect to /select-aml-supervisor with status 302", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });

    it("should return status 302 with acspData", async () => {
        const formData = {
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    premises: "Property Details",
                    addressLine1: "123 Test St",
                    addressLine2: "",
                    locality: "Test",
                    region: "Test",
                    country: "Test",
                    postalCode: "TE5 5TL"
                }
            }
        };
        const acspDataDiffAddress: AcspData = {
            id: "abc",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            },
            registeredOfficeAddress: {
                postalCode: "TE5 5TL"
            }
        };
        createMockSessionMiddleware(acspDataDiffAddress);
        const res = await router.post(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).send(formData);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL + "?lang=en");
    });

    it("should redirect to /select-aml-supervisor with status 302 same address", async () => {
        const formData = {
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    premises: "Property Details",
                    addressLine1: "123 Test St",
                    addressLine2: "",
                    locality: "Test",
                    region: "Test",
                    country: "Test",
                    postalCode: "TE5 5TL"
                }
            }
        };
        const acspDataSameAddress: AcspData = {
            id: "abc",
            typeOfBusiness: "SOLE_TRADER",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            },
            registeredOfficeAddress: {
                premises: "Property Details",
                addressLine1: "123 Test St",
                addressLine2: "",
                locality: "Test",
                region: "Test",
                country: "Test",
                postalCode: "TE5 5TL"
            }
        };
        createMockSessionMiddleware(acspDataSameAddress);
        const res = await router.post(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM).send(formData);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddlewareForSoleTrader).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL + "?lang=en");
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
