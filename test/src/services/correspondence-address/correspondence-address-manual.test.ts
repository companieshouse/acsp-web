import { Request } from "express";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { CorrespondenceAddressManualService } from "../../../../src/services/correspondence-address/correspondence-address-manual";
import { createRequest, MockRequest } from "node-mocks-http";

describe("CorrespondenceAddressManualService", () => {
    let service: CorrespondenceAddressManualService;
    let req: MockRequest<Request>;
    let acspData: AcspData;

    beforeEach(() => {
        service = new CorrespondenceAddressManualService();
        req = createRequest({
            method: "POST",
            url: "/"
        });
        acspData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe",
                correspondenceAddress: {
                    propertyDetails: "Suite 100",
                    line1: "123 Test St",
                    line2: "Apt 4",
                    town: "Test",
                    county: "Test",
                    country: "Test",
                    postcode: "TE5 5TL"
                }
            }
        };
    });

    test("saveCorrespondenceManualAddress correctly saves address to applicantDetails in acspData", () => {
        req.body = {
            addressPropertyDetails: "Suite 200",
            addressLine1: "456 Example St",
            addressLine2: "Suite 300",
            addressTown: "Example",
            addressCounty: "Example",
            addressCountry: "Example",
            addressPostcode: "EX1 1EX"
        };

        service.saveCorrespondenceManualAddress(req, acspData);

        expect(acspData.applicantDetails?.correspondenceAddress).toEqual({
            propertyDetails: "Suite 200",
            line1: "456 Example St",
            line2: "Suite 300",
            town: "Example",
            county: "Example",
            country: "Example",
            postcode: "EX1 1EX"
        });
    });

    test("getCorrespondenceManualAddress retrieves the correct address from acspData", () => {
        acspData.applicantDetails!.correspondenceAddress = {
            propertyDetails: "Suite 100",
            line1: "123 Test St",
            line2: "Apt 4",
            town: "Test",
            county: "Test",
            country: "Test",
            postcode: "TE5 5TL"
        };

        const retrievedAddress = service.getCorrespondenceManualAddress(acspData);

        expect(retrievedAddress).toEqual({
            propertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            addressCountry: "Test",
            addressPostcode: "TE5 5TL"
        });
    });

    test("getCorrespondenceManualAddress handles undefined applicantDetails or correspondenceAddress", () => {
        acspData.applicantDetails = undefined;

        const retrievedAddress = service.getCorrespondenceManualAddress(acspData);

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

        const retrievedAddress = service.getCorrespondenceManualAddress(acspData);

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
});
