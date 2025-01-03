import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { getProfileDetails, businessAddressAnswers } from "../../../../src/services/update-acsp/updateYourDetailsService";
import { getLocalesService } from "../../../../src/utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import {
    mockLimitedAcspFullProfile, mockSoleTraderAcspFullProfile,
    mockUnincorporatedAcspFullProfile, mockAddressWithoutPremisesAcspFullProfile,
    mockAddressWithoutAddressLine1AcspFullProfile, mockAddressWithoutAddressLine2AcspFullProfile,
    mockAddressWithoutLocalityAcspFullProfile, mockAddressWithoutRegionAcspFullProfile,
    mockAddressWithoutCountryAcspFullProfile, mockAddressWithoutPostalCodeAcspFullProfile
} from "../../../mocks/update_your_details.mock";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

describe("CheckYourAnswersService", () => {
    let req: MockRequest<Request>;
    let locales: any;

    beforeEach(() => {
    // initialize service and mock request object
        req = createRequest({
            method: "POST",
            url: "/",
            query: {
                lang: "en"
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        locales = getLocalesService();
    });

    it("should return answers for limited company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockLimitedAcspFullProfile);
        const limitedAnswers = getProfileDetails(req, mockLimitedAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(limitedAnswers).toStrictEqual({
            typeOfBusiness: "limited-company",
            correspondenceEmail: "john.doe@example.com",
            businessName: "Example ACSP Ltd",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers for sole-trader company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const soleTraderAnswers = getProfileDetails(req, mockSoleTraderAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(soleTraderAnswers).toStrictEqual({
            typeOfBusiness: "sole-trader",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            name: "John A. Doe",
            countryOfResidence: "united-kingdom",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers for unincorporated company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockUnincorporatedAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockUnincorporatedAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Premises", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPremisesAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutPremisesAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Address Line 1", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine1AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutAddressLine1AcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        console.log(unincorporatedAnswers);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "Another Building<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Address Line 2", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine2AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutAddressLine2AcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "Another Building 456 Another Street<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Locality", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutLocalityAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutLocalityAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Floor 2<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Region", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutRegionAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutRegionAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>united-kingdom<br>M1 2AB",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Country", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutCountryAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutCountryAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        console.log(unincorporatedAnswers);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>M1 2AB",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Postal Code", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPostalCodeAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(req, mockAddressWithoutPostalCodeAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            businessAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom",
            correspondenceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom"
        });
    });

    it("should not generate exception when service address is undefined", () => {
        const acspProfileData: AcspFullProfile = {} as AcspFullProfile;
        acspProfileData.serviceAddress = undefined;
        const businessAddressUndefined = businessAddressAnswers(acspProfileData);
        expect(businessAddressUndefined).toStrictEqual("");
    });
});
