import { Session } from "@companieshouse/node-session-handler";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { get } from "../../../../src/controllers/features/update-acsp/correspondenceAddressAutoLookupController";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LIST, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP } from "../../../../src/types/pageURL";
import { getAddressFromPostcode } from "../../../../src/services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import * as localise from "../../../../src/utils/localise";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS, SUBMISSION_ID } from "../../../../src/common/__utils/constants";
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

describe("GET" + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let sessionMock: Partial<Session>;
    beforeEach(() => {
        sessionMock = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
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
    it("should return 200 and render the page", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
    it("should populate postCode and premise when updateInProgress exists", async () => {
        const mockUpdateInProgressDetails = {
            postalCode: "SW1A 1AA",
            premises: "10"
        };

        const mockAcspUpdatedFullProfile = {
            type: "sole-trader",
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
    it("should populate postCode and premise for sole-trader type", async () => {
        const mockAcspUpdatedFullProfile = {
            type: "sole-trader",
            registeredOfficeAddress: {
                postalCode: "SW1A 1AA",
                premises: "10"
            }
        };

        (req.session!.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATED) {
                return mockAcspUpdatedFullProfile;
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

    it("should populate postCode and premise for non-sole-trader type", async () => {
        const mockAcspUpdatedFullProfile = {
            type: "limited-company",
            serviceAddress: {
                postalCode: "AB1 2CD",
                premises: "20"
            }
        };

        (req.session!.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATED) {
                return mockAcspUpdatedFullProfile;
            }
            return null;
        });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATED);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                postCode: "AB1 2CD",
                premise: "20"
            }
        }));
    });

    it("should handle missing registeredOfficeAddress and serviceAddress gracefully", async () => {
        const mockAcspUpdatedFullProfile = {
            type: "sole-trader"
        };

        (req.session!.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATED) {
                return mockAcspUpdatedFullProfile;
            }
            return null;
        });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATED);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                postCode: undefined,
                premise: undefined
            }
        }));
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, () => {

    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST + "?lang=en");
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };

        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(302); // Expect a redirect status code
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "2"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a full UK postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the correspondence address");
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the correspondence address");
    });

    it("should return status 400 for no postcode found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("Postcode not found"));

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find this postcode. Enter a different one, or enter the address manually");
    });

    it("should return status 400 when data entered has not changed", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: "11"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the correspondence address");
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
    });
    it("should return status 400 for no country found", async () => {
        const formData = {
            postCode: "AB12CD",
            premise: ""
        };
        (getAddressFromPostcode as jest.Mock).mockRejectedValueOnce(new Error("correspondenceLookUpAddressWithoutCountry"));

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("We cannot find the full address from the postcode. Enter the address manually");
    });
    it("should show the error page if an error occurs", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "2"
        };
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(mockResponseBodyOfUKAddress);

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
let customMockSessionMiddleware: any;

describe("GET" + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, () => {
    it("should return 200 and render the page with sole-trader type", async () => {
        createMockSessionMiddleware();
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });
});

describe("POST" + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, () => {
    it("should return status 400 when data entered has not changed", async () => {
        createMockSessionMiddleware();
        const formData = {
            postCode: "AB1 2CD",
            premise: "11"
        };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP).send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a UK postcode or cancel the update if you do not need to change the correspondence address");
        expect(res.text).toContain("Update the property name or number if it’s changed or cancel the update if you do not need to make any changes");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, type: "sole-trader" });
    session.setExtraData(ACSP_DETAILS, { ...dummyFullProfile, type: "sole-trader" });
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
