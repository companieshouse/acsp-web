import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { getProfileDetails } from "../../../../src/services/update-acsp/updateYourDetailsService";

import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import {
    mockLimitedAcspFullProfile, mockSoleTraderAcspFullProfile,
    mockUnincorporatedAcspFullProfile, mockAddressWithoutPremisesAcspFullProfile,
    mockAddressWithoutAddressLine1AcspFullProfile, mockAddressWithoutAddressLine2AcspFullProfile,
    mockAddressWithoutLocalityAcspFullProfile, mockAddressWithoutRegionAcspFullProfile,
    mockAddressWithoutCountryAcspFullProfile, mockAddressWithoutPostalCodeAcspFullProfile,
    mockUnincorpoatedAcspFullProfileNoServiceAddress
} from "../../../mocks/update_your_details.mock";

describe("CheckYourAnswersService", () => {
    let req: MockRequest<Request>;

    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/",
            query: {
                lang: "en"
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    it("should return answers for limited company journey", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_DETAILS, mockLimitedAcspFullProfile);
        const limitedAnswers = getProfileDetails(mockLimitedAcspFullProfile);
        expect(limitedAnswers).toStrictEqual({
            businessName: "Example ACSP Ltd",
            typeOfBusiness: "limited-company",
            correspondenceEmail: "john.doe@example.com",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers for sole-trader company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const soleTraderAnswers = getProfileDetails(mockSoleTraderAcspFullProfile);
        expect(soleTraderAnswers).toStrictEqual({
            typeOfBusiness: "sole-trader",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            name: "John A. Doe",
            countryOfResidence: "united-kingdom",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers for unincorporated company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockUnincorporatedAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockUnincorporatedAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Premises", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPremisesAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutPremisesAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Address Line 1", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine1AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutAddressLine1AcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Address Line 2", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine2AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutAddressLine2AcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Locality", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutLocalityAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutLocalityAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Region", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutRegionAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutRegionAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Country", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutCountryAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutCountryAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>"
        });
    });

    it("should return answers having addresses without Postal Code", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPostalCodeAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutPostalCodeAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p>",
            serviceAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p>"
        });
    });

    it("should return answers when no address is defined", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockUnincorpoatedAcspFullProfileNoServiceAddress);
        const unincorporatedAnswers = getProfileDetails(mockUnincorpoatedAcspFullProfileNoServiceAddress);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Floor 2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Greater Manchester</p><p class=\"govuk-body govuk-!-margin-bottom-0\">united-kingdom</p><p class=\"govuk-body govuk-!-margin-bottom-0\">M1 2AB</p>",
            serviceAddress: ""
        });
    });
});
