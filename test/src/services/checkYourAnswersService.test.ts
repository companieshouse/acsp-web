import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAnswers } from "../../../src/services/checkYourAnswersService";
import { getLocalesService } from "../../../src/utils/localise";
import { Company } from "../../../src/model/Company";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";
import { Answers } from "../../../src/model/Answers";

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
});
