import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { getAnswers } from "../../../src/services/checkYourAnswersService";
import { getLocalesService } from "../../../src/utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";
import { mockCompany, mockCorporateBodyAcspData, mockLimitedAcspData, mockLLPAcspData, mockLPAcspData, mockPartnershipAcspData, mockSoleTraderAcspData, mockUnincorporatedAcspData } from "../../mocks/check_your_answers.mock";

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
            workSector: "Auditors, insolvency practitioners, external accountants and tax advisers"
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
            workSector: "Financial institutions"
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
            nationality: "British"
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
            nameRegisteredWithAML: "Name of the business"
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
            name: "Test User"
        });
    });

    it("should return answers for corporate body journey", () => {
        const unincorporatedAnswers = getAnswers(req, mockCorporateBodyAcspData, locales.i18nCh.resolveNamespacesKeys(req.query.lang));

        expect(unincorporatedAnswers).toStrictEqual({
            businessName: "Test Business 123",
            correspondenceAddress: "premises addressLine1<br>addressLine2<br>locality<br>region<br>postalcode",
            businessAddress: "",
            roleType: "I am the equivalent to a director",
            typeOfBusiness: "Corporate body (registered with Companies House)",
            workSector: "Estate agents",
            nameRegisteredWithAML: "Your name",
            name: undefined
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
            name: "Test User"
        });
    });
});
