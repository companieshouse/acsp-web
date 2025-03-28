import { updateWithTheEffectiveDateAmendment } from "../../../../src/services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_ELEMENT,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_UPDATE_CHANGE_DATE
} from "../../../../src/common/__utils/constants";
import {
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHERE_DO_YOU_LIVE
} from "../../../../src/types/pageURL";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

jest.mock("@companieshouse/node-session-handler");

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
        const dateOfChange = new Date();
        const acspInProgress = { name: "New Business Name" };
        const acspUpdated = { name: "Old Business Name" };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_WHAT_IS_THE_BUSINESS_NAME;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdated.name).toBe(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, dateOfChange);
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
            if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_ACSP_WHAT_IS_YOUR_NAME;
        });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdatedFullProfile.soleTraderDetails!.forename).toBe(acspinProgressFullProfile.forename);
        expect(acspUpdatedFullProfile.soleTraderDetails!.otherForenames).toBe(acspinProgressFullProfile.otherForenames);
        expect(acspUpdatedFullProfile.soleTraderDetails!.surname).toBe(acspinProgressFullProfile.surname);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
        expect(session.deleteExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
    });

    it("should update the residential country and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { soleTraderDetails: { usualResidentialCountry: "UK" } };
        const acspUpdated = { soleTraderDetails: { usualResidentialCountry: "" } };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_WHERE_DO_YOU_LIVE;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdated.soleTraderDetails!.usualResidentialCountry).toBe(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE, dateOfChange);
    });

    it("should update the registered office address and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { registeredOfficeAddress: { addressLine1: "123 Street" } };
        const acspUpdated = { registeredOfficeAddress: {} };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_BUSINESS_ADDRESS_CONFIRM;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdated.registeredOfficeAddress).toEqual(acspInProgress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, dateOfChange);
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
            if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM;
        });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdatedFullProfile.serviceAddress).toEqual(acspinProgressFullProfile);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS, dateOfChange);
    });
});
