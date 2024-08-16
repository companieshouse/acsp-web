import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAnswers } from "../../../src/services/checkYourAnswersService";
import { getLocalesService } from "../../../src/utils/localise";
import { Company } from "../../../src/model/Company";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";

const mockLimitedAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "LC",
    roleType: "DIRECTOR",
    workSector: "AIA",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        }
    }
};
const mockSoleTraderAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    roleType: "SOLE_TRADER",
    workSector: "ILP",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        },
        firstName: "Unit",
        middleName: "Test",
        lastName: "User",
        dateOfBirth: new Date(1990, 10, 15),
        nationality: {
            firstNationality: "British"
        },
        countryOfResidence: "England"
    },
    businessName: "Test Business 123"
};
const mockPartnershipAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "PARTNERSHIP",
    roleType: "MEMBER_OF_PARTNERSHIP",
    workSector: "TCSP",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        }
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "NAME_OF_THE_BUSINESS",
    registeredOfficeAddress: {
        premises: "premises",
        addressLine1: "addressLine1",
        addressLine2: "addressLine2",
        locality: "locality",
        region: "region",
        postalCode: "postalcode"
    }
};
const mockUnincorporatedAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "UNINCORPORATED",
    roleType: "MEMBER_OF_ENTITY",
    workSector: "CI",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        },
        firstName: "Test",
        lastName: "User"
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "BOTH",
    registeredOfficeAddress: {
        premises: "premises",
        addressLine1: "addressLine1",
        addressLine2: "addressLine2",
        locality: "locality",
        region: "region",
        postalCode: "postalcode"
    }
};
const mockCompany: Company = {
    companyName: "Test Company",
    companyNumber: "12345678",
    registeredOfficeAddress: {
        addressLineOne: "Address 1",
        addressLineTwo: "Address 2",
        careOf: "",
        country: "country",
        locality: "locality",
        poBox: "",
        postalCode: "AB1 2CD",
        premises: "premise",
        region: "region"
    }
};

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

    it("should return answers for limited journey", () => {
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
});
