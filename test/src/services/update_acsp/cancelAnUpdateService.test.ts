import { createRequest, MockRequest, Session } from "node-mocks-http";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { cancelAnUpdate } from "../../../../src/services/update-acsp/cancelAnUpdateService";

describe("cancelAnUpdateService tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/",
            query: {
                cancel: ""
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        session.setExtraData(ACSP_DETAILS, dummyFullProfile);
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should reset the 'name' field when cancel query is 'businessName'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "businessName";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                name: "Wrong Name"
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).name).toBe(dummyFullProfile.name);
    });
    it("should reset the 'usualResidentialCountry' field when cancel query is 'usualResidentialCountry'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "usualResidentialCountry";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                usualResidentialCountry: "Wrong country"
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).soleTraderDetails.usualResidentialCountry).toBe(dummyFullProfile.soleTraderDetails!.usualResidentialCountry);
    });
    it("should reset the 'serviceAddress' field when cancel query is 'serviceAddress'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "serviceAddress";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                serviceAddress: {
                    addressLine1: "wrong address"
                }
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).serviceAddress).toBe(dummyFullProfile.serviceAddress);
    });
    it("should reset the 'registeredOfficeAddress' field when cancel query is 'registeredOfficeAddress'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "registeredOfficeAddress";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                registeredOfficeAddress: {
                    addressLine1: "wrong address"
                }
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).registeredOfficeAddress).toBe(dummyFullProfile.registeredOfficeAddress);
    });
    it("should reset the 'email' field when cancel query is 'email'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "email";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                registeredOfficeAddress: {
                    email: "wrong email"
                }
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).email).toBe(dummyFullProfile.email);
    });
    it("should reset the soleTraderDetails name fields when cancel query is 'personName'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "personName";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                soleTraderDetails: {
                    forename: "wrong forname",
                    otherForenames: "Wrong other fornames",
                    surname: "Wrong surname"
                }
            }
        );
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).soleTraderDetails.forename).toBe(dummyFullProfile.soleTraderDetails!.forename);
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).soleTraderDetails.otherForenames).toBe(dummyFullProfile.soleTraderDetails!.otherForenames);
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).soleTraderDetails.surname).toBe(dummyFullProfile.soleTraderDetails!.surname);
    });
    it("should delete the correspondence address date for sole trader when cancel query is 'registeredOfficeAddress'", () => {
        const session: Session = req.session as any as Session;
        req.query.cancel = "registeredOfficeAddress";
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                type: "sole-trader",
                registeredOfficeAddress: {
                    addressLine1: "wrong address"
                }
            });
        cancelAnUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATED).registeredOfficeAddress).toBe(dummyFullProfile.registeredOfficeAddress);
    });
});
