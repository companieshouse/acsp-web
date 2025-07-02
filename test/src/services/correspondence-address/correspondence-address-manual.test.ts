import { Request } from "express";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { CorrespondenceAddressManualService } from "../../../../src/services/correspondence-address/correspondence-address-manual";
import { createRequest, MockRequest } from "node-mocks-http";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../../src/common/__utils/constants";

describe("CorrespondenceAddressManualService", () => {
    let service: CorrespondenceAddressManualService;
    let req: MockRequest<Request>;
    let acspData: AcspData;
    let acspDetails: AcspFullProfile;

    beforeEach(() => {
        service = new CorrespondenceAddressManualService();
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        acspData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    premises: "Suite 100",
                    addressLine1: "123 Test St",
                    addressLine2: "Apt 4",
                    locality: "Test",
                    region: "Test",
                    country: "Test",
                    postalCode: "TE5 5TL"
                }
            }
        };
        acspDetails = {
            number: "",
            name: "",
            status: "",
            type: "",
            notifiedFrom: new Date(),
            email: "",
            amlDetails: [],
            registeredOfficeAddress: {}
        };
    });

    test("saveCorrespondenceManualAddress correctly saves address to applicantDetails in acspData", () => {
        req.body = {
            addressPropertyDetails: "Suite 200",
            addressLine1: "456 Example St",
            addressLine2: "Suite 300",
            addressTown: "Example",
            addressCounty: "Example",
            countryInput: "Example",
            addressPostcode: "EX1 1EX"
        };

        service.saveCorrespondenceManualAddress(req, acspData);

        expect(acspData.applicantDetails?.correspondenceAddress).toEqual({
            premises: "Suite 200",
            addressLine1: "456 Example St",
            addressLine2: "Suite 300",
            locality: "Example",
            region: "Example",
            country: "Example",
            postalCode: "EX1 1EX"
        });
    });

    test("getCorrespondenceManualAddress retrieves the correct address from acspData", () => {
        acspData.applicantDetails!.correspondenceAddress = {
            premises: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            locality: "Test",
            region: "Test",
            country: "Test",
            postalCode: "TE5 5TL"
        };

        const retrievedAddress = service.getCorrespondenceManualAddress(acspData.applicantDetails?.correspondenceAddress);

        expect(retrievedAddress).toEqual({
            addressPropertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            countryInput: "Test",
            addressPostcode: "TE5 5TL"
        });
    });

    test("getCorrespondenceManualAddress handles undefined applicantDetails or correspondenceAddress", () => {

        const retrievedAddress = service.getCorrespondenceManualAddress(undefined);

        expect(retrievedAddress).toEqual({
            propertyDetails: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            addressTown: undefined,
            addressCounty: undefined,
            addressCountry: undefined,
            addressPostcode: undefined
        });
    });

    test("getCorrespondenceManualAddress handles defined applicantDetails but undefined correspondenceAddress", () => {
        acspData.applicantDetails!.correspondenceAddress = undefined;

        const retrievedAddress = service.getCorrespondenceManualAddress(acspData.applicantDetails?.correspondenceAddress);

        expect(retrievedAddress).toEqual({
            propertyDetails: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            addressTown: undefined,
            addressCounty: undefined,
            addressCountry: undefined,
            addressPostcode: undefined
        });
    });

    test("getCorrespondenceManualAddress handles undefined acspData", () => {
        const acspDataUndefined = undefined;

        const retrievedAddress = service.getCorrespondenceManualAddress(acspDataUndefined);

        expect(retrievedAddress).toEqual({
            propertyDetails: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            addressTown: undefined,
            addressCounty: undefined,
            addressCountry: undefined,
            addressPostcode: undefined
        });
    });

    test("saveCorrespondenceManualAddressUpdate correctly saves address to acspDetails", () => {
        const session: Session = req.session as any as Session;
        req.body = {
            addressPropertyDetails: "Suite 200",
            addressLine1: "456 Example St",
            addressLine2: "Suite 300",
            addressTown: "Example",
            addressCounty: "Example",
            countryInput: "Example",
            addressPostcode: "EX1 1EX"
        };

        service.saveManualAddressUpdate(req);

        expect(session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)).toEqual({
            premises: "Suite 200",
            addressLine1: "456 Example St",
            addressLine2: "Suite 300",
            locality: "Example",
            region: "Example",
            country: "Example",
            postalCode: "EX1 1EX"
        });
    });

    test("getCorrespondenceManualAddress retrieves the correct address from acspDetails", () => {
        acspDetails.serviceAddress = {
            premises: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            locality: "Test",
            region: "Test",
            country: "Test",
            postalCode: "TE5 5TL"
        };

        const retrievedAddressUpdate = service.getCorrespondenceManualAddress(acspDetails.serviceAddress);

        expect(retrievedAddressUpdate).toEqual({
            addressPropertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            countryInput: "Test",
            addressPostcode: "TE5 5TL"
        });
    });

    test("getCorrespondenceManualAddress retrieves the correct address from acspDetails", () => {
        acspDetails.serviceAddress = undefined;

        const retrievedAddressUpdate = service.getCorrespondenceManualAddress(acspDetails.serviceAddress);

        expect(retrievedAddressUpdate).toEqual({
            addressPropertyDetails: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            addressTown: undefined,
            addressCounty: undefined,
            countryInput: undefined,
            addressPostcode: undefined
        });
    });
});
