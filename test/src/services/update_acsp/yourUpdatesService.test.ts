import { getFormattedUpdates, getFormattedRemovedAMLUpdates, getFormattedAddedAMLUpdates } from "../../../../src/services/update-acsp/yourUpdatesService";
import { createRequest, MockRequest } from "node-mocks-http";
import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_UPDATE_CHANGE_DATE } from "../../../../src/common/__utils/constants";
import { Request } from "express";

describe("yourUpdatesService", () => {
    let req: MockRequest<Request>;
    let acspFullProfile: AcspFullProfile;
    let updatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/",
            query: {
                cancel: ""
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        acspFullProfile = {
            number: "",
            status: "",
            notifiedFrom: new Date(1, 1, 1999),
            name: "Old Name",
            email: "old@example.com",
            type: "limited-company",
            registeredOfficeAddress: { addressLine1: "Old Address" },
            serviceAddress: { addressLine1: "Old Service Address" },
            amlDetails: []
        } as AcspFullProfile;
        updatedFullProfile = {
            number: "",
            status: "",
            notifiedFrom: new Date(1, 1, 1999),
            name: "New Name",
            email: "new@example.com",
            type: "limited-company",
            registeredOfficeAddress: { addressLine1: "New Address" },
            serviceAddress: { addressLine1: "New Service Address" },
            amlDetails: []
        } as AcspFullProfile;
    });

    it("should format updates when business name changes", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, new Date(2021, 1, 1).toISOString());
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.businessName).toEqual({
            value: "New Name",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when email address changes", () => {
        const session: Session = req.session as any as Session;
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.correspondenceEmail).toEqual({
            value: "new@example.com"
        });
    });

    it("should format updates when registered office address changes for limited companies", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, new Date(2021, 1, 1).toISOString());
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.registeredOfficeAddress).toEqual({
            value: "New Address",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when service address changes for limited companies", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS, new Date(2021, 1, 1).toISOString());
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.serviceAddress).toEqual({
            value: "New Service Address",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when business address changes for unincorporated entities", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "unincorporated-entity";
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.businessAddress).toEqual({
            value: "New Address",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when service address changes for unincorporated entities", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "unincorporated-entity";
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.serviceAddress).toEqual({
            value: "New Service Address",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when name changes for unincorporated entities", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "unincorporated-entity";
        acspFullProfile.soleTraderDetails = { forename: "Old", surname: "Name" };
        updatedFullProfile.soleTraderDetails = { forename: "New", surname: "Name" };
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.name).toEqual({
            value: "New Name",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when name changes for sole traders", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "sole-trader";
        acspFullProfile.soleTraderDetails = { forename: "Old", surname: "Name" };
        updatedFullProfile.soleTraderDetails = { forename: "New", surname: "Name" };
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.name).toEqual({
            value: "New Name",
            changedDate: "01 February 2021"
        });
    });

    it("should format updates when usual residential country changes for sole traders", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "sole-trader";
        acspFullProfile.soleTraderDetails = { usualResidentialCountry: "Old Country" };
        updatedFullProfile.soleTraderDetails = { usualResidentialCountry: "New Country" };
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.usualResidentialCountry).toEqual({
            value: "New Country",
            changedDate: "01 February 2021"
        });
    });

    it("should format correspondence address for sole trader", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, new Date(2021, 1, 1).toISOString());
        acspFullProfile.type = "sole-trader";
        acspFullProfile.soleTraderDetails = undefined;
        updatedFullProfile.soleTraderDetails = undefined;
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.serviceAddress).toEqual({
            value: "New Address",
            changedDate: "01 February 2021"
        });
    });

    it("should format removed AML updates", () => {
        acspFullProfile.amlDetails = [{ supervisoryBody: "association-of-chartered-certified-accountants-acca", membershipDetails: "123" }];
        updatedFullProfile.amlDetails = [];
        const removedAMLUpdates = getFormattedRemovedAMLUpdates(acspFullProfile, updatedFullProfile);
        expect(removedAMLUpdates).toEqual([{
            membershipName: "association-of-chartered-certified-accountants-acca",
            membershipNumber: "123",
            changedDate: "19 March 2025"
        }]);
    });

    it("should format added AML updates", () => {
        acspFullProfile.amlDetails = [];
        updatedFullProfile.amlDetails = [{ supervisoryBody: "association-of-international-accountants-aia", membershipDetails: "123" }];
        const addedAMLUpdates = getFormattedAddedAMLUpdates(acspFullProfile, updatedFullProfile);
        expect(addedAMLUpdates).toEqual([{
            membershipName: "association-of-international-accountants-aia",
            membershipNumber: "123",
            changedDate: "19 March 2025"
        }]);
    });
});
