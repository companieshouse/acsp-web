import { updateWithTheEffectiveDateAmendment, getPreviousPageUrlDateOfChange } from "../../../../src/services/update-acsp/dateOfTheChangeService";

import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_UPDATE_PREVIOUS_PAGE_URL,
    ADD_AML_BODY_UPDATE,
    NEW_AML_BODY
} from "../../../../src/common/__utils/constants";
import {
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_AML_MEMBERSHIP_NUMBER,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHERE_DO_YOU_LIVE
} from "../../../../src/types/pageURL";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { AmlDetails } from "../../../../src/model/AcspFullProfile";

jest.mock("@companieshouse/node-session-handler");
jest.mock("../../../../src/services/url");

describe("updateWithTheEffectiveDateAmendment", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn(),
            deleteExtraData: jest.fn()
        };

        req = {
            session: session as Session
        } as Partial<Request>;
    });

    it("should update the business name and set the change date", () => {
        const dateOfChange = new Date("2025-04-03T14:24:38.901Z");
        const acspInProgress = { name: "New Business Name" };
        const acspUpdated = { name: "Old Business Name" };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_WHAT_IS_THE_BUSINESS_NAME;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange.toISOString());

        expect(acspUpdated.name).toBe(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, dateOfChange.toISOString());
    });

    it("should update sole trader details and set the change date", () => {
        const dateOfChange = new Date();
        const acspinProgressFullProfile: AcspFullProfile["soleTraderDetails"] = {
            forename: "John",
            otherForenames: "Doe",
            surname: "Smith"
        };
        const acspUpdatedFullProfile: AcspFullProfile = {
            soleTraderDetails: {},
            number: "",
            name: "",
            status: "",
            type: "",
            notifiedFrom: new Date(),
            email: "",
            amlDetails: [],
            registeredOfficeAddress: {
                addressLine1: "",
                addressLine2: "",
                postalCode: "",
                country: ""
            }
        };

        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspinProgressFullProfile;
            if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
            if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_ACSP_WHAT_IS_YOUR_NAME;
        });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange.toISOString());

        expect(acspUpdatedFullProfile.soleTraderDetails!.forename).toBe(acspinProgressFullProfile.forename);
        expect(acspUpdatedFullProfile.soleTraderDetails!.otherForenames).toBe(acspinProgressFullProfile.otherForenames);
        expect(acspUpdatedFullProfile.soleTraderDetails!.surname).toBe(acspinProgressFullProfile.surname);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange.toISOString());
    });

    it("should update the residential country and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { soleTraderDetails: { usualResidentialCountry: "UK" } };
        const acspUpdated = { soleTraderDetails: { usualResidentialCountry: "" } };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_WHERE_DO_YOU_LIVE;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange.toISOString());

        expect(acspUpdated.soleTraderDetails!.usualResidentialCountry).toBe(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE, dateOfChange.toISOString());
    });

    it("should update the registered office address and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { registeredOfficeAddress: { addressLine1: "123 Street" } };
        const acspUpdated = { registeredOfficeAddress: {} };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_BUSINESS_ADDRESS_CONFIRM;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange.toISOString());

        expect(acspUpdated.registeredOfficeAddress).toEqual(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, dateOfChange.toISOString());
    });

    it("should update serviceAddress for non-sole trader and set the change date", () => {
        const dateOfChange = new Date();
        const acspinProgressFullProfile = {
            type: "non-sole-trader",
            serviceAddress: { addressLine1: "456 Avenue", addressLine2: "Town", postalCode: "XY45 6ZT" }
        };
        const acspUpdatedFullProfile = {
            serviceAddress: {}
        };

        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspinProgressFullProfile;
            if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
            if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM;
        });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange.toISOString());

        expect(acspUpdatedFullProfile.serviceAddress).toEqual(acspinProgressFullProfile);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS, dateOfChange.toISOString());
    });

    it("should add dateOfChange to NEW_AML_BODY and push all properties to acspUpdatedFullProfile", () => {
        const dateOfChange = "2025-01-01T00:00:00.000Z";
        const newAMLBody = {
            amlSupervisoryBody: "association-of-chartered-certified-accountants-acca",
            membershipId: "123456",
            dateOfChange: undefined
        };
        const acspUpdatedFullProfile: { amlDetails: AmlDetails[] } = {
            amlDetails: []
        };

        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_AML_MEMBERSHIP_NUMBER;
            if (key === NEW_AML_BODY) return newAMLBody;
            if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
        });

        expect(acspUpdatedFullProfile.amlDetails).toEqual([]);

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(newAMLBody.dateOfChange).toBe(dateOfChange);
        expect(session.setExtraData).toHaveBeenCalledWith(NEW_AML_BODY, newAMLBody);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(1);
        expect(acspUpdatedFullProfile.amlDetails[0].supervisoryBody).toBe(newAMLBody.amlSupervisoryBody);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe(newAMLBody.membershipId);
        expect(acspUpdatedFullProfile.amlDetails[0].dateOfChange).toBe(newAMLBody.dateOfChange);

        expect(session.setExtraData).toHaveBeenCalledWith(NEW_AML_BODY, newAMLBody);
        expect(session.deleteExtraData).toHaveBeenCalledWith(NEW_AML_BODY);
    });

    it("should update aml details when editing NEW_AML_BODY and push to acspUpdatedFullProfile when index exists", () => {
        const dateOfChange = "2025-01-01T00:00:00.000Z";
        const updatedDateOfChange = "2025-02-02T00:00:00.000Z";
        const updateIndex = 0;
        const acspUpdatedFullProfile: { amlDetails: AmlDetails[] } = {
            amlDetails: [{
                supervisoryBody: "association-of-chartered-certified-accountants-acca",
                membershipDetails: "123456",
                dateOfChange: dateOfChange
            }]
        };
        const newAMLBody = {
            amlSupervisoryBody: "hm-revenue-customs-hmrc",
            membershipId: "654321",
            dateOfChange: updatedDateOfChange
        };

        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) return UPDATE_AML_MEMBERSHIP_NUMBER;
            if (key === ADD_AML_BODY_UPDATE) return updateIndex;
            if (key === NEW_AML_BODY) return newAMLBody;
            if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
        });

        updateWithTheEffectiveDateAmendment(req as Request, updatedDateOfChange);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(1);
        expect(acspUpdatedFullProfile.amlDetails[0].supervisoryBody).toBe(newAMLBody.amlSupervisoryBody);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe(newAMLBody.membershipId);
        expect(acspUpdatedFullProfile.amlDetails[0].dateOfChange).toBe(newAMLBody.dateOfChange);
    });
});

describe("getPreviousPageUrlDateOfChange", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn(),
            deleteExtraData: jest.fn()
        };

        req = {
            session: session as Session
        } as Partial<Request>;

        jest.clearAllMocks();
    });

    it("should return the value from ACSP_UPDATE_PREVIOUS_PAGE_URL if it exists in the session", () => {
        const previousPageUrl = "/some-previous-page";
        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_UPDATE_PREVIOUS_PAGE_URL) {
                return previousPageUrl;
            }
            return null;
        });

        const result = getPreviousPageUrlDateOfChange(req as Request);

        expect(result).toBe(previousPageUrl);
        expect(session.getExtraData).toHaveBeenCalledWith(ACSP_UPDATE_PREVIOUS_PAGE_URL);
        expect(session.setExtraData).not.toHaveBeenCalled();
    });
});
