import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { getProfileDetails } from "../../../../src/services/update-acsp/updateYourDetailsService";
import { getLocalesService } from "../../../../src/utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import { mockLimitedAcspFullProfile, mockSoleTraderAcspFullProfile } from "../../../mocks/update_your_details.mock";

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
console.log(limitedAnswers);
        expect(limitedAnswers).toStrictEqual({
            typeOfBusiness: 'limited-company',
            correspondenceEmail: 'john.doe@example.com',
            businessName: 'Example ACSP Ltd',
            correspondenceAddress: 'Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB'
        });
    });

    it("should return answers for sole-trader company journey", () => {
        const session: Session = req.session as any as Session;
        
        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const soleTraderAnswers = getProfileDetails(req, mockSoleTraderAcspFullProfile, locales.i18nCh.resolveNamespacesKeys(req.query.lang));
        console.log(soleTraderAnswers);
        expect(soleTraderAnswers).toStrictEqual({
            typeOfBusiness: 'sole-trader',
            correspondenceEmail: 'john.doe@example.com',
            businessName: 'John Doe',
            name: 'John A. Doe',
            countryOfResidence: 'British',
            correspondenceAddress: 'Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB'
    });
    });
});
