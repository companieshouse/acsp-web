import { Request } from "express";
import { createRequest, MockRequest } from "node-mocks-http";
import { AddressLookUpService } from "../../../../src/services/address/addressLookUp";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ukAddress1, ukAddressList } from "../../../mocks/address.mock";
import { ACSP_DETAILS_UPDATED, ADDRESS_LIST, USER_DATA } from "../../../../src/common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { getCountryFromKey } from "../../../../src/utils/web";
import { getAddressFromPostcode } from "../../../../src/services/postcode-lookup-service";
import { BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";

const service = new AddressLookUpService();

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/postcode-lookup-service.ts");

const postalCode: string = "AB12CD";

describe("addressLookupService tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/",
            body: {
                postCode: postalCode
            }
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    describe("saveBusinessAddressToSession tests", () => {
        it("should save business address to session", () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, {});
            service.saveBusinessAddressToSession(req, ukAddressList, "1");
            expect(session.getExtraData(USER_DATA)).toEqual({
                registeredOfficeAddress: {
                    premises: ukAddress1.premise,
                    addressLine1: ukAddress1.addressLine1,
                    addressLine2: ukAddress1.addressLine2,
                    locality: ukAddress1.postTown,
                    country: getCountryFromKey(ukAddress1.country!),
                    postalCode: ukAddress1.postcode
                }
            });
        });
    });
    describe("getAddressFromPostcode tests", () => {
        it("should return the first next page URL when a valid premise is found for business address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, {});
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.getAddressFromPostcode(req, postalCode, "1", session.getExtraData(USER_DATA)!, true, "/nextPage1", "/nextPage2");

            expect(result).toBe(BASE_URL + "/nextPage1?lang=en");
            expect(session.getExtraData(USER_DATA)).toEqual({
                registeredOfficeAddress: {
                    premises: ukAddress1.premise,
                    addressLine1: ukAddress1.addressLine1,
                    addressLine2: ukAddress1.addressLine2,
                    locality: ukAddress1.postTown,
                    country: getCountryFromKey(ukAddress1.country!),
                    postalCode: ukAddress1.postcode
                }
            });
        });
        it("should return the first next page URL when a valid premise is found for correspondence address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, {});
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.getAddressFromPostcode(req, postalCode, "1", session.getExtraData(USER_DATA)!, false, "/nextPage1", "/nextPage2");

            expect(result).toBe(BASE_URL + "/nextPage1?lang=en");
            expect(session.getExtraData(USER_DATA)).toEqual({
                applicantDetails: {
                    correspondenceAddress: {
                        premises: ukAddress1.premise,
                        addressLine1: ukAddress1.addressLine1,
                        addressLine2: ukAddress1.addressLine2,
                        locality: ukAddress1.postTown,
                        country: getCountryFromKey(ukAddress1.country!),
                        postalCode: ukAddress1.postcode
                    }
                }
            });
        });
        it("should return the second next page URL when premise is not found in list for business address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, {});
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.getAddressFromPostcode(req, postalCode, "5", session.getExtraData(USER_DATA)!, true, "/nextPage1", "/nextPage2");

            expect(result).toBe(BASE_URL + "/nextPage2?lang=en");
            expect(session.getExtraData(USER_DATA)).toEqual({
                registeredOfficeAddress: {
                    postalCode: postalCode
                }
            });
        });
        it("should return the second next page URL when premise is not found in list for correspondence address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(USER_DATA, {});
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.getAddressFromPostcode(req, postalCode, "5", session.getExtraData(USER_DATA)!, false, "/nextPage1", "/nextPage2");

            expect(result).toBe(BASE_URL + "/nextPage2?lang=en");
            expect(session.getExtraData(USER_DATA)).toEqual({
                applicantDetails: {
                    correspondenceAddress: {
                        postalCode: postalCode
                    }
                }
            });
        });
        it("should throw an error when getAddressFromPostcode fails", async () => {
            (getAddressFromPostcode as jest.Mock).mockRejectedValue(new Error("Failed to fetch addresses"));

            await expect(service.getAddressFromPostcode(req, "postcode", "1", {}, true, "/nextPage1", "/nextPage2")).rejects.toThrow("Failed to fetch addresses");
        });
    });
    describe("processAddressFromPostcodeUpdateJourney tests", () => {
        it("should return the first next page URL when a valid premise is found for business address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.processAddressFromPostcodeUpdateJourney(req, postalCode, "1", session.getExtraData(ACSP_DETAILS_UPDATED)!, true, "/nextPage1", "/nextPage2");

            expect(result).toBe(UPDATE_ACSP_DETAILS_BASE_URL + "/nextPage1?lang=en");
            expect(session.getExtraData(ACSP_DETAILS_UPDATED)).toEqual({
                ...dummyFullProfile,
                registeredOfficeAddress: {
                    premises: ukAddress1.premise,
                    addressLine1: ukAddress1.addressLine1,
                    addressLine2: ukAddress1.addressLine2,
                    locality: ukAddress1.postTown,
                    country: getCountryFromKey(ukAddress1.country!),
                    postalCode: ukAddress1.postcode
                }
            });
        });
        it("should return the first next page URL when a valid premise is found for correspondence address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.processAddressFromPostcodeUpdateJourney(req, postalCode, "1", session.getExtraData(ACSP_DETAILS_UPDATED)!, false, "/nextPage1", "/nextPage2");

            expect(result).toBe(UPDATE_ACSP_DETAILS_BASE_URL + "/nextPage1?lang=en");
            expect(session.getExtraData(ACSP_DETAILS_UPDATED)).toEqual({
                ...dummyFullProfile,
                serviceAddress: {
                    premises: ukAddress1.premise,
                    addressLine1: ukAddress1.addressLine1,
                    addressLine2: ukAddress1.addressLine2,
                    locality: ukAddress1.postTown,
                    country: getCountryFromKey(ukAddress1.country!),
                    postalCode: ukAddress1.postcode
                }
            });
        });
        it("should return the second next page URL when premise is not found in list for business address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.processAddressFromPostcodeUpdateJourney(req, postalCode, "5", session.getExtraData(ACSP_DETAILS_UPDATED)!, true, "/nextPage1", "/nextPage2");

            expect(result).toBe(UPDATE_ACSP_DETAILS_BASE_URL + "/nextPage2?lang=en");
            expect(session.getExtraData(ACSP_DETAILS_UPDATED)).toEqual({
                ...dummyFullProfile,
                registeredOfficeAddress: {
                    postalCode: postalCode
                }
            });
        });
        it("should return the second next page URL when premise is not found in list for correspondence address", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
            (getAddressFromPostcode as jest.Mock).mockResolvedValueOnce(ukAddressList);

            const result = await service.processAddressFromPostcodeUpdateJourney(req, postalCode, "5", session.getExtraData(ACSP_DETAILS_UPDATED)!, false, "/nextPage1", "/nextPage2");

            expect(result).toBe(UPDATE_ACSP_DETAILS_BASE_URL + "/nextPage2?lang=en");
            expect(session.getExtraData(ACSP_DETAILS_UPDATED)).toEqual({
                ...dummyFullProfile,
                serviceAddress: {
                    postalCode: postalCode
                }
            });
        });
        it("should throw an error when getAddressFromPostcode fails", async () => {
            (getAddressFromPostcode as jest.Mock).mockRejectedValue(new Error("Failed to fetch addresses"));

            await expect(service.processAddressFromPostcodeUpdateJourney(req, "postcode", "1", dummyFullProfile, true, "/nextPage1", "/nextPage2")).rejects.toThrow("Failed to fetch addresses");
        });
    });
});
