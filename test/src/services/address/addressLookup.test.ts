import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { AddressLookUpService } from "../../../../src/services/address/addressLookUp";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ukAddress1, ukAddressList } from "../../../mocks/address.mock";
import { USER_DATA } from "../../../../src/common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { getCountryFromKey } from "../../../../src/utils/web";

const service = new AddressLookUpService();

describe("saveBusinessAddressToSession tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    it("should save business address to session", () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(USER_DATA, {});
        service.saveBusinessAddressToSession(req, ukAddressList, "1");
        expect(session.getExtraData(USER_DATA)).toEqual({
            registeredOfficeAddress: {
                propertyDetails: ukAddress1.premise,
                line1: ukAddress1.addressLine1,
                line2: ukAddress1.addressLine2,
                town: ukAddress1.postTown,
                country: getCountryFromKey(ukAddress1.country!),
                postcode: ukAddress1.postcode
            }
        });
    });
});
