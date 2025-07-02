import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { getAnswers } from "../../../src/services/checkYourAnswersService";
import { getLocalesService } from "../../../src/utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";
import { mockCompany, mockLimitedAcspData, mockLLPAcspData, mockLPAcspData, mockPartnershipAcspData, mockSoleTrader2AcspData, mockSoleTrader3AcspData, mockSoleTraderAcspData, mockUnincorporatedAcspData } from "../../mocks/check_your_answers.mock";

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
            businessAddress: "Address 1<p class='govuk-body govuk-!-margin-bottom-0'>Address 2</p><p class='govuk-body govuk-!-margin-bottom-0'>locality</p><p class='govuk-body govuk-!-margin-bottom-0'>region</p><p class='govuk-body govuk-!-margin-bottom-0'>AB1 2CD</p><p class='govuk-body govuk-!-margin-bottom-0'>country</p>",
            businessName: "Test Company",
            companyNumber: "12345678",
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
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
            businessAddress: "Address 1<p class='govuk-body govuk-!-margin-bottom-0'>Address 2</p><p class='govuk-body govuk-!-margin-bottom-0'>locality</p><p class='govuk-body govuk-!-margin-bottom-0'>region</p><p class='govuk-body govuk-!-margin-bottom-0'>AB1 2CD</p><p class='govuk-body govuk-!-margin-bottom-0'>country</p>",
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
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
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

    it("should return answers for sole trader journey with Prefer not to say work sector", () => {
        const soleTraderAnswers = getAnswers(req, mockSoleTrader3AcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(soleTraderAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "",
            roleType: "I am a member of the governing body",
            typeOfBusiness: "Sole trader",
            workSector: "Prefer not to say",
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
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
            businessAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
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
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
            businessAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
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
            businessAddress: "Address 1<p class='govuk-body govuk-!-margin-bottom-0'>Address 2</p><p class='govuk-body govuk-!-margin-bottom-0'>locality</p><p class='govuk-body govuk-!-margin-bottom-0'>region</p><p class='govuk-body govuk-!-margin-bottom-0'>AB1 2CD</p><p class='govuk-body govuk-!-margin-bottom-0'>country</p>",
            businessName: "Test Company",
            companyNumber: "12345678",
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
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
            correspondenceAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
            businessAddress: "premises addressLine1<p class=\"govuk-body govuk-!-margin-bottom-0\">addressLine2</p><p class=\"govuk-body govuk-!-margin-bottom-0\">locality</p><p class=\"govuk-body govuk-!-margin-bottom-0\">region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">postalcode</p>",
            roleType: "I am a general partner",
            typeOfBusiness: "Limited partnership (LP)",
            workSector: "High value dealers",
            nameRegisteredWithAML: "Your name",
            name: "Test User",
            correspondenceEmail: undefined
        });
    });

    it("should handle all address fields as undefined with just addressLineOne defined", () => {
        const mockCompany = {
            companyName: "Test Ltd",
            companyNumber: "12345678",
            registeredOfficeAddress: {
                addressLineOne: "1 Main St",
                addressLineTwo: undefined,
                locality: undefined,
                region: undefined,
                postalCode: undefined,
                country: undefined
            }
        };

        const mockSession = {
            getExtraData: (key: string) => {
                if (key === COMPANY_DETAILS) return mockCompany;
                return undefined;
            }
        };

        const req: any = { session: mockSession };
        const acspData = { typeOfBusiness: "LC" };
        const i18n = {};

        const answers = getAnswers(req, acspData as any, i18n);

        expect(answers.businessName).toBe("Test Ltd");
        expect(answers.companyNumber).toBe("12345678");
        expect(answers.businessAddress).toBe("1 Main St");
    });
});
