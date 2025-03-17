import { determinePreviousPageUrl, updateWithTheEffectiveDateAmendment } from "../../../../src/services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_ELEMENT,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_PROFILE_TYPE_SOLE_TRADER
} from "../../../../src/common/__utils/constants";
import {
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHAT_IS_YOUR_EMAIL,
    UPDATE_WHERE_DO_YOU_LIVE,
    UPDATE_YOUR_ANSWERS
} from "../../../../src/types/pageURL";

jest.mock("@companieshouse/node-session-handler");

describe("updateWithTheEffectiveDateAmendment", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
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

        expect(acspUpdated.name).toBe(acspInProgress.name);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
    });

    it("should update sole trader details and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { soleTraderDetails: { forename: "John", otherForenames: "Doe", surname: "Smith", usualResidentialCountry: "England" } };
        const acspUpdated = { soleTraderDetails: { usualResidentialCountry: "England" } };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_ACSP_WHAT_IS_YOUR_NAME;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdated.soleTraderDetails).toEqual(acspInProgress.soleTraderDetails);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
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

        expect(acspUpdated.soleTraderDetails!.usualResidentialCountry).toBe(acspInProgress.soleTraderDetails!.usualResidentialCountry);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, dateOfChange);
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

        expect(acspUpdated.registeredOfficeAddress).toEqual(acspInProgress.registeredOfficeAddress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
    });

    it("should update the correspondence address and set the change date", () => {
        const dateOfChange = new Date();
        const acspInProgress = { registeredOfficeAddress: { addressLine1: "123 Street" }, type: ACSP_PROFILE_TYPE_SOLE_TRADER };
        const acspUpdated = { registeredOfficeAddress: {}, serviceAddress: {} };

        (session.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return acspInProgress;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdated;
                if (key === ACSP_DETAILS_UPDATE_ELEMENT) return UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM;
            });

        updateWithTheEffectiveDateAmendment(req as Request, dateOfChange);

        expect(acspUpdated.registeredOfficeAddress).toEqual(acspInProgress.registeredOfficeAddress);
        expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS, dateOfChange);
    });
});

describe("determinePreviousPageUrl", () => {
    it("should return UPDATE_ACSP_WHAT_IS_YOUR_NAME if the URL includes UPDATE_ACSP_WHAT_IS_YOUR_NAME", () => {
        const url = `some/path/${UPDATE_ACSP_WHAT_IS_YOUR_NAME}`;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_ACSP_WHAT_IS_YOUR_NAME);
    });

    it("should return UPDATE_WHERE_DO_YOU_LIVE if the URL includes UPDATE_WHERE_DO_YOU_LIVE", () => {
        const url = `some/path/${UPDATE_WHERE_DO_YOU_LIVE}`;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHERE_DO_YOU_LIVE);
    });

    it("should return UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP if the URL includes UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
        const url = `some/path/${UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM}`;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP);
    });

    it("should return UPDATE_WHAT_IS_YOUR_EMAIL if the URL includes UPDATE_WHAT_IS_YOUR_EMAIL", () => {
        const url = `some/path/${UPDATE_WHAT_IS_YOUR_EMAIL}`;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHAT_IS_YOUR_EMAIL);
    });

    it("should return UPDATE_WHAT_IS_THE_BUSINESS_NAME if the URL includes UPDATE_WHAT_IS_THE_BUSINESS_NAME", () => {
        const url = `some/path/${UPDATE_WHAT_IS_THE_BUSINESS_NAME}`;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHAT_IS_THE_BUSINESS_NAME);
    });

    it("should return UPDATE_YOUR_ANSWERS if the URL does not match any specific case", () => {
        const url = "some/path/unknown";
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_YOUR_ANSWERS);
    });

    it("should return UPDATE_YOUR_ANSWERS if the URL is undefined", () => {
        const url = "";
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_YOUR_ANSWERS);
    });
});
