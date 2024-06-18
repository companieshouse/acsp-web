import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { businessAddressAnswers, correspondenceAddressAnswers, isThisYourCompanyAnswers } from "../../../src/services/checkYourAnswersService";
import { AcspData, Company } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA } from "../../../src/common/__utils/constants";
import { address1, address2 } from "../../mocks/address.mock";

describe("CheckYourAnswersService", () => {
    let req: MockRequest<Request>;

    const mockAcspData: AcspData = {
        id: "123",
        correspondenceAddress: address1,
        businessAddress: address2
    };

    beforeEach(() => {
    // initialize service and mock request object
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    it("should save business details to session", () => {
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
        isThisYourCompanyAnswers(req, mockCompany);
        const session: Session = req.session as any as Session;

        expect(session.getExtraData(ANSWER_DATA)).toEqual({
            businessName: "Test Company",
            companyNumber: "12345678",
            businessAddress: "Address 1<br>Address 2<br>locality<br>region<br>AB1 2CD<br>country"
        });
    });

    it("should save correspondence address answer string to session", () => {
        correspondenceAddressAnswers(req, mockAcspData);
        const session: Session = req.session as any as Session;

        expect(session.getExtraData(ANSWER_DATA)).toEqual({
            correspondenceAddress: "1 Mock Street<br>Mock Town<br>Mock County<br>Mock Country<br>AB12CD"
        });
    });

    it("should save business address answer string to session", () => {
        businessAddressAnswers(req, mockAcspData);
        const session: Session = req.session as any as Session;

        expect(session.getExtraData(ANSWER_DATA)).toEqual({
            businessAddress: "2 Mock Street<br>Mock Town<br>Mock County<br>Mock Country<br>AB12CD"
        });
    });
});
