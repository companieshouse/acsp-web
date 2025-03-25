import { AddressLookUpService } from "../../../../src/services/address/addressLookUp";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../../../src/common/__utils/sessionHelper";
import { addLangToUrl, selectLang } from "../../../../src/utils/localise";
import { getAddressFromPostcode } from "../../../../src/services/postcode-lookup-service";
import { getCountryFromKey } from "../../../../src/utils/web";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ADDRESS_LIST, USER_DATA } from "../../../../src/common/__utils/constants";
import { BASE_URL } from "../../../../src/types/pageURL";

jest.mock("../../../../src/common/__utils/sessionHelper");
jest.mock("../../../../src/services/postcode-lookup-service");
jest.mock("../../../../src/utils/web");
jest.mock("../../../../src/utils/localise");

describe("AddressLookUpService", () => {
    let service: AddressLookUpService;
    let req: Partial<Request>;
    let session: Partial<Session>;

    beforeEach(() => {
        service = new AddressLookUpService();

        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
        };

        req = {
            session: session as Session,
            body: {},
            lang: "en" // Add a default language property
        } as Partial<Request>;
    });

    describe("saveBusinessAddressToSession", () => {
        it("should save the business address to the session", async () => {
            const ukAddresses: UKAddress[] = [
                {
                    premise: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "AB12 3CD"
                }
            ];
            const inputPremise = "123";
            const acspData: AcspData = { registeredOfficeAddress: {} };

            (session.getExtraData as jest.Mock).mockReturnValue(acspData);

            await service.saveBusinessAddressToSession(req as Request, ukAddresses, inputPremise);

            expect(session.getExtraData).toHaveBeenCalledWith(USER_DATA);
            expect(saveDataInSession).toHaveBeenCalledWith(req, USER_DATA, {
                registeredOfficeAddress: {
                    premises: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    locality: "Town",
                    country: undefined,
                    postalCode: "AB12 3CD"
                }
            });
        });
    });

    describe("saveAddressListToSession", () => {
        it("should save the address list to the session", () => {
            const ukAddresses: UKAddress[] = [
                {
                    premise: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "AB12 3CD"
                },
                {
                    premise: "456",
                    addressLine1: "Street 2",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "XY45 6ZT"
                }
            ];

            (getCountryFromKey as jest.Mock).mockReturnValue("United Kingdom");

            service.saveAddressListToSession(req as Request, ukAddresses);

            expect(saveDataInSession).toHaveBeenCalledWith(req, ADDRESS_LIST, [
                {
                    premises: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    locality: "Town",
                    country: "United Kingdom",
                    postalCode: "AB12 3CD",
                    formattedAddress: "123, Street 1, Town, United Kingdom, AB12 3CD"
                },
                {
                    premises: "456",
                    addressLine1: "Street 2",
                    addressLine2: "City",
                    locality: "Town",
                    country: "United Kingdom",
                    postalCode: "XY45 6ZT",
                    formattedAddress: "456, Street 2, Town, United Kingdom, XY45 6ZT"
                }
            ]);
        });
    });
    describe("AddressLookUpService - getAddressFromPostcode", () => {
        let service: AddressLookUpService;
        let req: Partial<Request>;
        let acspData: AcspData;

        beforeEach(() => {
            service = new AddressLookUpService();

            req = {
                query: {},
                body: {}
            } as Partial<Request>;

            acspData = {
                registeredOfficeAddress: {},
                applicantDetails: {}
            } as AcspData;
        });

        it("should save business address and return the next page URL if input premise is found", async () => {
            const postcode = "AB12 3CD";
            const inputPremise = "123";
            const ukAddresses: UKAddress[] = [
                {
                    premise: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "AB12 3CD"
                }
            ];

            (getAddressFromPostcode as jest.Mock).mockResolvedValue(ukAddresses);
            (selectLang as jest.Mock).mockReturnValue("en");
            (addLangToUrl as jest.Mock).mockReturnValue(`${BASE_URL}/next-page`);

            const nextPageUrl = await service.getAddressFromPostcode(
                req as Request,
                postcode,
                inputPremise,
                acspData,
                true,
                "/next-page",
                "/error-page"
            );

            expect(getAddressFromPostcode).toHaveBeenCalledWith(postcode);
            expect(addLangToUrl).toHaveBeenCalledWith(`${BASE_URL}/next-page`, "en");
            expect(nextPageUrl).toBe(`${BASE_URL}/next-page`);
        });

        it("should save correspondence address and return the next page URL if input premise is found", async () => {
            const postcode = "AB12 3CD";
            const inputPremise = "123";
            const ukAddresses: UKAddress[] = [
                {
                    premise: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "AB12 3CD"
                }
            ];

            (getAddressFromPostcode as jest.Mock).mockResolvedValue(ukAddresses);
            (selectLang as jest.Mock).mockReturnValue("en");
            (addLangToUrl as jest.Mock).mockReturnValue(`${BASE_URL}/next-page`);

            const nextPageUrl = await service.getAddressFromPostcode(
                req as Request,
                postcode,
                inputPremise,
                acspData,
                false,
                "/next-page",
                "/error-page"
            );

            expect(getAddressFromPostcode).toHaveBeenCalledWith(postcode);
            expect(addLangToUrl).toHaveBeenCalledWith(`${BASE_URL}/next-page`, "en");
            expect(nextPageUrl).toBe(`${BASE_URL}/next-page`);
        });

        it("should save address list and return the error page URL if input premise is not found", async () => {
            const postcode = "AB12 3CD";
            const inputPremise = "999";
            const ukAddresses: UKAddress[] = [
                {
                    premise: "123",
                    addressLine1: "Street 1",
                    addressLine2: "City",
                    postTown: "Town",
                    country: "UK",
                    postcode: "AB12 3CD"
                }
            ];

            (getAddressFromPostcode as jest.Mock).mockResolvedValue(ukAddresses);
            (selectLang as jest.Mock).mockReturnValue("en");
            (addLangToUrl as jest.Mock).mockReturnValue(`${BASE_URL}/error-page`);

            const errorPageUrl = await service.getAddressFromPostcode(
                req as Request,
                postcode,
                inputPremise,
                acspData,
                true,
                "/next-page",
                "/error-page"
            );

            expect(getAddressFromPostcode).toHaveBeenCalledWith(postcode);
            expect(addLangToUrl).toHaveBeenCalledWith(`${BASE_URL}/error-page`, "en");
            expect(errorPageUrl).toBe(`${BASE_URL}/error-page`);
        });

        it("should throw an error if getAddressFromPostcode fails", async () => {
            const postcode = "AB12 3CD";
            const inputPremise = "123";
            const error = new Error("Test error");

            (getAddressFromPostcode as jest.Mock).mockRejectedValue(error);

            await expect(
                service.getAddressFromPostcode(
                    req as Request,
                    postcode,
                    inputPremise,
                    acspData,
                    true,
                    "/next-page",
                    "/error-page"
                )
            ).rejects.toThrow(error);

            expect(getAddressFromPostcode).toHaveBeenCalledWith(postcode);
        });
    });
});
