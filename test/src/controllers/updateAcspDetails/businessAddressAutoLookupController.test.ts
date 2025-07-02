import mocks from "../../../mocks/all_middleware_mock";
import { Session } from "@companieshouse/node-session-handler";
import supertest from "supertest";
import app from "../../../../src/app";
import { get } from "../../../../src/controllers/features/update-acsp/businessAddressAutoLookupController";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_LIST, UPDATE_BUSINESS_ADDRESS_LOOKUP } from "../../../../src/types/pageURL";
import { getAddressFromPostcode } from "../../../../src/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import * as localise from "../../../../src/utils/localise";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { Request, Response, NextFunction } from "express";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/postcode-lookup-service.ts");
jest.mock("../../../../src/services/update-acsp/updateYourDetailsService");

const router = supertest(app);

const mockResponseBodyOfUKAddress: UKAddress[] = [{
    premise: "2",
    addressLine1: "DUNCALF STREET",
    postTown: "STOKE-ON-TRENT",
    postcode: "ST6 3LJ",
    country: "GB-ENG"
}];

describe("Business address auto look up tests", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let sessionMock: Partial<Session>;
    beforeEach(() => {
        sessionMock = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn(),
            deleteExtraData: jest.fn()
        };

        req = {
            session: sessionMock as Session,
            query: {}
        } as Partial<Request>;

        res = {
            render: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should return 200 and render the page", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the business address?");
    });
    it("should populate payload using when updateInProgress exists", async () => {
        const mockUpdateInProgressDetails = {
            postalCode: "SW1A 1AA",
            premises: "10"
        };

        const mockAcspUpdatedFullProfile = {
            registeredOfficeAddress: {
                postalCode: "AB1 2CD",
                premises: "20"
            }
        };

        (req.session!.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                    return mockUpdateInProgressDetails;
                }
                if (key === ACSP_DETAILS_UPDATED) {
                    return mockAcspUpdatedFullProfile;
                }
                return null;
            });

        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                postCode: "SW1A 1AA",
                premise: "10"
            }
        }));
    });

    it("should handle gracefully when acspUpdatedFullProfile is false", async () => {
        const mockUpdateInProgressDetails = {
            postalCode: "SW1A 1AA",
            premises: "10"
        };

        (req.session!.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                return mockUpdateInProgressDetails;
            }
            if (key === ACSP_DETAILS_UPDATED) {
                return false;
            }
            return null;
        });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATED);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                postCode: "SW1A 1AA",
                premise: "10"
            }
        }));
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

let customMockSessionMiddleware: any;

describe("POST" + UPDATE_BUSINESS_ADDRESS_LOOKUP, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LIST + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 for postcode not found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("Postcode not found"));

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find this postcode. Enter a different one, or enter the address manually");
    });
    UPDATE_ACSP_DETAILS_BASE_URL;
    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the business address");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the business address");
    });

    it("should return status 400 for no country found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("correspondenceLookUpAddressWithoutCountry"));

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find the full address from the postcode. Enter the address manually");
    });

    it("should return status 400 when data entered has not changed", async () => {
        const formData = {
            postCode: "AB1 2CD",
            premise: "11"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the business address");
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
    });

    it("should return status 400 when data entered has not changed", async () => {
        createMockSessionMiddleware();
        const formData = {
            postCode: "AB1 2CD",
            premise: "11"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the registered office address");
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
    });

    it("should show the error page if an error occurs", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS, { ...dummyFullProfile, type: "limited-company" });
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, type: "limited-company" });
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
