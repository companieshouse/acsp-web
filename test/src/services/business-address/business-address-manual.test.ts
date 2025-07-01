import { Request } from "express";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { createRequest, MockRequest } from "node-mocks-http";
import { BusinessAddressService } from "../../../../src/services/business-address/businessAddressService";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

describe("CorrespondenceAddressManualService", () => {
    let service: BusinessAddressService;
    let req: MockRequest<Request>;
    let acspData: AcspData;
    let acspFullProfile: AcspFullProfile;

    beforeEach(() => {
        service = new BusinessAddressService();
        req = createRequest({
            method: "POST",
            url: "/"
        });
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    test("getBusinessManualAddress retrieves the correct address from acspData", () => {
        acspData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            },
            registeredOfficeAddress: {
                premises: "Suite 100",
                addressLine1: "123 Test St",
                addressLine2: "Apt 4",
                locality: "Test",
                region: "Test",
                country: "Test",
                postalCode: "TE5 5TL"
            }
        };

        const retrievedAddress = service.getBusinessManualAddress(acspData);

        expect(retrievedAddress).toEqual({
            addressPropertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            addressCountry: "Test",
            addressPostcode: "TE5 5TL"
        });
    });

    test("getBusinessManualAddress retrieves the correct address from acspData when no country", () => {
        acspData = {
            id: "abc",
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            },
            registeredOfficeAddress: {
                premises: "Suite 100",
                addressLine1: "123 Test St",
                addressLine2: "Apt 4",
                locality: "Test",
                region: "Test",
                postalCode: "TE5 5TL"
            }
        };

        const retrievedAddress = service.getBusinessManualAddress(acspData);

        expect(retrievedAddress).toEqual({
            addressPropertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            addressCountry: undefined,
            addressPostcode: "TE5 5TL"
        });
    });

    test("getBusinessManualAddress retrieves the correct address from acspFullProfile", () => {
        acspFullProfile = {
            number: "",
            name: "",
            status: "",
            type: "",
            notifiedFrom: new Date(),
            email: "",
            amlDetails: [],
            registeredOfficeAddress: {
                premises: "Suite 100",
                addressLine1: "123 Test St",
                addressLine2: "Apt 4",
                locality: "Test",
                region: "Test",
                country: "NORTHERN IRELAND",
                postalCode: "TE5 5TL"
            }
        };

        const retrievedAddress = service.getBusinessManualAddress(acspFullProfile);

        expect(retrievedAddress).toEqual({
            addressPropertyDetails: "Suite 100",
            addressLine1: "123 Test St",
            addressLine2: "Apt 4",
            addressTown: "Test",
            addressCounty: "Test",
            addressCountry: "Northern Ireland",
            addressPostcode: "TE5 5TL"
        });
    });
});
