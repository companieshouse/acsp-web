import { createRequest, MockRequest, Session } from "node-mocks-http";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { amlSupervisor } from "../../../../src/services/update-acsp/amlSupervisorService";

describe("removeAMLService tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/",
            query: {
                amlindex: ""
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        session.setExtraData(ACSP_DETAILS, dummyFullProfile);
    });
    it("should reset the 'usualResidentialCountry' field when cancel query is 'usualResidentialCountry'", () => {
        const session: Session = req.session as any as Session;
        req.query.amlindex = "123456789";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                amlDetails: [{
                    supervisoryBody: "",
                    membershipDetails: ""
                }]
            }
        );
        amlSupervisor(req);
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].supervisoryBody).toBe("hm-revenue-customs-hmrc");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].membershipDetails).toBe("123456789");
    });
    it("should reset the 'name' field when cancel query is 'businessName'", () => {
        const session: Session = req.session as any as Session;
        req.query.amlindex = "123456789";
        session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
        amlSupervisor(req);
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].supervisoryBody).toBe("");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].membershipDetails).toBe("");
    });
});
