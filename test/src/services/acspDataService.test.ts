import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AcspDataService } from "../../../src/services/acspDataService";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { APPLICATION_ID, USER_DATA } from "../../../src/common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { postAcspRegistration, putAcspRegistration } from "../../../src/services/acspRegistrationService";

jest.mock("../../../src/services/acspRegistrationService");

const service = new AcspDataService();

const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;

const mockAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};

const mockPostResponce = {
    id: "12345"
};

describe("AcspDataService tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    describe("saveAcspData tests", () => {
        it("should call POST registration if acspData is undefined", () => {
            const session: Session = req.session as any as Session;
            const acspData: AcspData | undefined = undefined;
            mockPostAcspRegistration.mockResolvedValueOnce(mockPostResponce);
            service.saveAcspData(session, acspData!, "SOLE_TRADER");
            expect(mockPostAcspRegistration).toHaveBeenCalled();
        });

        it("should call PUT registration if acspData is not undefined", () => {
            const session: Session = req.session as any as Session;
            service.saveAcspData(session, mockAcspData, "SOLE_TRADER");
            expect(mockPutAcspRegistration).toHaveBeenCalled();
        });

        it("should call PUT registration if acspData is not undefined", () => {
            const session: Session = req.session as any as Session;
            service.saveAcspData(session, mockAcspData);
            expect(mockPutAcspRegistration).toHaveBeenCalled();
        });
    });

    describe("typeOfBusinessChange tests", () => {
        it("should return acspData if typeOfBusiness is the same", () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, mockAcspData);
            const retunredAcspData = service.typeOfBusinessChange(session, mockAcspData, "SOLE_TRADER");
            expect(retunredAcspData).toEqual(mockAcspData);
        });

        it("should clear USER_DATA and update acspData if typeOfBusiness changes", () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, mockAcspData);
            const retunredAcspData = service.typeOfBusinessChange(session, mockAcspData, "PARTNERSHIP");
            expect(retunredAcspData).toEqual({
                id: "1234",
                typeOfBusiness: "PARTNERSHIP",
                amlSupervisoryBodies: undefined,
                applicantDetails: undefined,
                businessName: undefined,
                companyAuthCodeProvided: undefined,
                companyDetails: undefined,
                howAreYouRegisteredWithAml: undefined,
                registeredOfficeAddress: undefined,
                roleType: undefined,
                verified: undefined,
                workSector: undefined
            });
            expect(session.getExtraData(USER_DATA)).toEqual(undefined);
        });
    });
});
