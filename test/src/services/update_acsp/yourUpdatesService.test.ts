import { getFormattedUpdates, getFormattedRemovedAMLUpdates, getFormattedAddedAMLUpdates } from "../../../../src/services/update-acsp/yourUpdatesService";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

describe("yourUpdatesService", () => {
    let session: Session;
    let acspFullProfile: AcspFullProfile;
    let updatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        session = {} as Session;
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
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.businessName).toEqual({
            value: "New Name",
            changedDate: expect.any(String)
        });
    });

    it("should format updates when email address changes", () => {
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.correspondenceEmail).toEqual({
            value: "new@example.com",
            changedDate: expect.any(String)
        });
    });

    it("should format updates when registered office address changes for limited companies", () => {
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.registeredOfficeAddress).toEqual({
            value: expect.any(String),
            changedDate: expect.any(String)
        });
    });

    it("should format updates when service address changes for limited companies", () => {
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.serviceAddress).toEqual({
            value: expect.any(String),
            changedDate: expect.any(String)
        });
    });

    it("should format updates when business address changes for unincorporated entities", () => {
        acspFullProfile.type = "unincorporated-entity";
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.businessAddress).toEqual({
            value: expect.any(String),
            changedDate: expect.any(String)
        });
    });

    it("should format updates when service address changes for unincorporated entities", () => {
        acspFullProfile.type = "unincorporated-entity";
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.serviceAddress).toEqual({
            value: expect.any(String),
            changedDate: expect.any(String)
        });
    });

    it("should format updates when name changes for sole traders", () => {
        acspFullProfile.type = "sole-trader";
        acspFullProfile.soleTraderDetails = { forename: "Old", surname: "Name" };
        updatedFullProfile.soleTraderDetails = { forename: "New", surname: "Name" };
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.name).toEqual({
            value: expect.any(String),
            changedDate: expect.any(String)
        });
    });

    it("should format updates when usual residential country changes for sole traders", () => {
        acspFullProfile.type = "sole-trader";
        acspFullProfile.soleTraderDetails = { usualResidentialCountry: "Old Country" };
        updatedFullProfile.soleTraderDetails = { usualResidentialCountry: "New Country" };
        const updates = getFormattedUpdates(session, acspFullProfile, updatedFullProfile);
        expect(updates.usualResidentialCountry).toEqual({
            value: "New Country",
            changedDate: expect.any(String)
        });
    });

    it("should format removed AML updates", () => {
        acspFullProfile.amlDetails = [{ supervisoryBody: "association-of-chartered-certified-accountants-acca", membershipDetails: "123" }];
        updatedFullProfile.amlDetails = [];
        const removedAMLUpdates = getFormattedRemovedAMLUpdates(acspFullProfile, updatedFullProfile);
        expect(removedAMLUpdates).toEqual([{
            membershipName: "Association of Chartered Certified Accountants (ACCA)",
            membershipNumber: "123",
            changedDate: expect.any(String)
        }]);
    });

    it("should format added AML updates", () => {
        acspFullProfile.amlDetails = [];
        updatedFullProfile.amlDetails = [{ supervisoryBody: "association-of-international-accountants-aia", membershipDetails: "123" }];
        const addedAMLUpdates = getFormattedAddedAMLUpdates(acspFullProfile, updatedFullProfile);
        expect(addedAMLUpdates).toEqual([{
            membershipName: "Association of International Accountants (AIA)",
            membershipNumber: "123",
            changedDate: expect.any(String)
        }]);
    });
});
