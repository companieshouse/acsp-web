import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { getAnswers } from "../../../src/services/checkYourAnswersService";
import { getLocalesService } from "../../../src/utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";
import { mockCompany, mockLimitedAcspData, mockLLPAcspData, mockLPAcspData, mockPartnershipAcspData, mockSoleTrader2AcspData, mockSoleTrader3AcspData, mockSoleTraderAcspData, mockSoleTraderAcspDataWorkSectorNotProvided, mockUnincorporatedAcspData } from "../../mocks/check_your_answers.mock";

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
        session.setExtraData(COMPANY_DETAILS, mockCompany);
        const limitedAnswers = getAnswers(req, mockLimitedAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(limitedAnswers).toStrictEqual({
            businessAddress: "Address 1<br>Address 2<br>locality<br>region<br>AB1 2CD<br>country",
            businessName: "Test Company",
            companyNumber: "12345678",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am a director",
            typeOfBusiness: "Limited company",
            workSector: "Auditors, insolvency practitioners, external accountants and tax advisers",
            correspondenceEmail: "test@email.com"
        });
    });

    it("should return answers for LLP journey", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(COMPANY_DETAILS, mockCompany);
        const limitedAnswers = getAnswers(req, mockLLPAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(limitedAnswers).toStrictEqual({
            businessAddress: "Address 1<br>Address 2<br>locality<br>region<br>AB1 2CD<br>country",
            correspondenceAddress: "",
            businessName: "Test Company",
            companyNumber: "12345678",
            roleType: "I am a member of the partnership",
            typeOfBusiness: "Limited liability partnership (LLP)",
            workSector: "Financial institutions",
            correspondenceEmail: "test@email.com"
        });
    });

    it("should return answers for sole trader journey", () => {
        const soleTraderAnswers = getAnswers(req, mockSoleTraderAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(soleTraderAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am the sole trader",
            typeOfBusiness: "Sole trader",
            workSector: "Independent legal professionals",
            countryOfResidence: "England",
            dateOfBirth: "15 November 1990",
            name: "Unit Test User",
            nationality: "British",
            correspondenceEmail: "test@email.com"
        });
    });

    it("should return answers for sole trader journey with work sector not provided", () => {
        const soleTraderAnswers = getAnswers(req, mockSoleTraderAcspDataWorkSectorNotProvided, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(soleTraderAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am the sole trader",
            typeOfBusiness: "Sole trader",
            workSector: "Not provided",
            countryOfResidence: "England",
            dateOfBirth: "15 November 1990",
            name: "Unit Test User",
            nationality: "British",
            correspondenceEmail: "test@email.com"
        });
    });

    it("should return answers for sole trader journey with multiple nationalities", () => {
        const soleTraderAnswers = getAnswers(req, mockSoleTrader2AcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(soleTraderAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "",
            roleType: "I am a member of the governing body",
            typeOfBusiness: "Sole trader",
            workSector: "Casinos",
            countryOfResidence: "England",
            dateOfBirth: "15 November 1990",
            name: "Unit Test User",
            nationality: "British, German, Irish",
            correspondenceEmail: undefined
        });
    });

    it("should return answers for sole trader journey with Estate agents work sector", () => {
        const soleTraderAnswers = getAnswers(req, mockSoleTrader3AcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(soleTraderAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "",
            roleType: "I am a member of the governing body",
            typeOfBusiness: "Sole trader",
            workSector: "Estate agents",
            countryOfResidence: "England",
            dateOfBirth: "15 November 1990",
            name: "Unit Test User",
            nationality: "British, German, Irish",
            correspondenceEmail: undefined
        });
    });

    it("should return answers for partnership journey", () => {
        const unincorporatedAnswers = getAnswers(req, mockPartnershipAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(unincorporatedAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            businessAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am a member",
            typeOfBusiness: "Partnership (not registered with Companies House)",
            workSector: "Trust or company service providers",
            nameRegisteredWithAML: "Name of the business",
            correspondenceEmail: undefined
        });
    });

    it("should return answers for unincorporated journey", () => {
        const unincorporatedAnswers = getAnswers(req, mockUnincorporatedAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(unincorporatedAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            businessAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am a member",
            typeOfBusiness: "Unincorporated entity",
            workSector: "Credit institutions",
            nameRegisteredWithAML: "Both",
            name: "Test User",
            correspondenceEmail: undefined
        });
    });

    it("should return answers for corporate body journey", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(COMPANY_DETAILS, mockCompany);
        const limitedAnswers = getAnswers(req, mockLimitedAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(limitedAnswers).toStrictEqual({
            businessAddress: "Address 1<br>Address 2<br>locality<br>region<br>AB1 2CD<br>country",
            businessName: "Test Company",
            companyNumber: "12345678",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am a director",
            typeOfBusiness: "Limited company",
            workSector: "Auditors, insolvency practitioners, external accountants and tax advisers",
            correspondenceEmail: "test@email.com"
        });
    });

    it("should return answers for Limited partnership journey", () => {
        const unincorporatedAnswers = getAnswers(req, mockLPAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(unincorporatedAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            businessAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            roleType: "I am a general partner",
            typeOfBusiness: "Limited partnership (LP)",
            workSector: "High value dealers",
            nameRegisteredWithAML: "Your name",
            name: "Test User",
            correspondenceEmail: undefined
        });
    });
});
