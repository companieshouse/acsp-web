import { Request } from "express";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { getProfileDetails, validateUpdatesWithoutDate } from "../../../../src/services/update-acsp/updateYourDetailsService";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import {
    mockLimitedAcspFullProfile, mockSoleTraderAcspFullProfile,
    mockUnincorporatedAcspFullProfile, mockAddressWithoutPremisesAcspFullProfile,
    mockAddressWithoutAddressLine1AcspFullProfile, mockAddressWithoutAddressLine2AcspFullProfile,
    mockAddressWithoutLocalityAcspFullProfile, mockAddressWithoutRegionAcspFullProfile,
    mockAddressWithoutCountryAcspFullProfile, mockAddressWithoutPostalCodeAcspFullProfile,
    mockUnincorpoatedAcspFullProfileNoServiceAddress
} from "../../../mocks/update_your_details.mock";

describe("CheckYourAnswersService", () => {
    let req: MockRequest<Request>;

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
    });

    it("should return answers for limited company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockLimitedAcspFullProfile);
        const limitedAnswers = getProfileDetails(mockLimitedAcspFullProfile);
        expect(limitedAnswers).toStrictEqual({
            businessName: "Example ACSP Ltd",
            typeOfBusiness: "limited-company",
            correspondenceEmail: "john.doe@example.com",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers for sole-trader company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const soleTraderAnswers = getProfileDetails(mockSoleTraderAcspFullProfile);
        expect(soleTraderAnswers).toStrictEqual({
            typeOfBusiness: "sole-trader",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            name: "John A. Doe",
            countryOfResidence: "united-kingdom",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers for unincorporated company journey", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockUnincorporatedAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockUnincorporatedAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Premises", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPremisesAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutPremisesAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Address Line 1", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine1AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutAddressLine1AcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Address Line 2", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutAddressLine2AcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutAddressLine2AcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Locality", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutLocalityAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutLocalityAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Greater Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Region", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutRegionAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutRegionAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>united-kingdom<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Country", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutCountryAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutCountryAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>M1 2AB"
        });
    });

    it("should return answers having addresses without Postal Code", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockAddressWithoutPostalCodeAcspFullProfile);
        const unincorporatedAnswers = getProfileDetails(mockAddressWithoutPostalCodeAcspFullProfile);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom",
            serviceAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom"
        });
    });

    it("should return answers when no address is defined", () => {
        const session: Session = req.session as any as Session;

        session.setExtraData(ACSP_DETAILS, mockUnincorpoatedAcspFullProfileNoServiceAddress);
        const unincorporatedAnswers = getProfileDetails(mockUnincorpoatedAcspFullProfileNoServiceAddress);
        expect(unincorporatedAnswers).toStrictEqual({
            typeOfBusiness: "unincorporated-entity",
            correspondenceEmail: "john.doe@example.com",
            businessName: "John Doe",
            registeredOfficeAddress: "Another Building 456 Another Street<br>Floor 2<br>Manchester<br>Greater Manchester<br>united-kingdom<br>M1 2AB",
            serviceAddress: ""
        });
    });
});

describe("validateUpdatesWithoutDate", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;
    let acspFullProfile: AcspFullProfile;
    let acspUpdatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn()
        };

        req = {
            session: session as Session
        } as Partial<Request>;

        acspFullProfile = {
            name: "Original Name",
            soleTraderDetails: {
                forename: "John",
                otherForenames: "Doe",
                surname: "Smith",
                usualResidentialCountry: "UK"
            },
            registeredOfficeAddress: {
                addressLine1: "123 Street",
                addressLine2: "Apt 4",
                locality: "City",
                region: "Region",
                postalCode: "12345",
                country: "UK"
            },
            serviceAddress: {
                addressLine1: "456 Avenue",
                addressLine2: "Suite 8",
                locality: "Town",
                region: "Region",
                postalCode: "67890",
                country: "UK"
            }
        } as AcspFullProfile;

        acspUpdatedFullProfile = {
            name: "Updated Name",
            soleTraderDetails: {
                forename: "Jane1",
                otherForenames: "Doe1",
                surname: "Doe2",
                usualResidentialCountry: "US"
            },
            registeredOfficeAddress: {
                addressLine1: "789 Boulevard",
                addressLine2: "Floor 10",
                locality: "Village",
                region: "Region",
                postalCode: "54321",
                country: "US"
            },
            serviceAddress: {
                addressLine1: "101 Parkway",
                addressLine2: "Unit 12",
                locality: "Hamlet",
                region: "Region",
                postalCode: "98765",
                country: "US"
            }
        } as AcspFullProfile;
    });

    it("should update name if NAMEOFBUSINESS change date is null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.name).toBe(acspFullProfile.name);
    });

    it("should update soleTraderDetails if NAME change date is null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.forename).toBe(acspUpdatedFullProfile.soleTraderDetails!.forename);
        expect(result.soleTraderDetails!.otherForenames).toBe(acspUpdatedFullProfile.soleTraderDetails!.otherForenames);
        expect(result.soleTraderDetails!.surname).toBe(acspUpdatedFullProfile.soleTraderDetails!.surname);
    });

    it("should update usualResidentialCountry if WHEREDOYOULIVE change date is null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.usualResidentialCountry).toBe(acspFullProfile.soleTraderDetails!.usualResidentialCountry);
    });

    it("should update registeredOfficeAddress if REGOFFICEADDRESS change date is null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.registeredOfficeAddress).toEqual(acspFullProfile.registeredOfficeAddress);
    });

    it("should update serviceAddress if CORRESPONDENCEADDRESS change date is null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.serviceAddress).toEqual(acspFullProfile.serviceAddress);
    });

    it("should not update fields if change dates are not null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce("2023-01-01").mockReturnValueOnce("2023-01-01").mockReturnValueOnce("2023-01-01").mockReturnValueOnce("2023-01-01").mockReturnValueOnce("2023-01-01");

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result).toEqual(acspUpdatedFullProfile);
    });
});

describe("validateUpdatesWithoutDate", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;
    let acspFullProfile: AcspFullProfile;
    let acspUpdatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn()
        };

        req = {
            session: session as Session
        } as Partial<Request>;

        acspFullProfile = {
            soleTraderDetails: {
                forename: "John",
                otherForenames: "Doe",
                surname: "Smith",
                usualResidentialCountry: "UK"
            }
        } as AcspFullProfile;

        acspUpdatedFullProfile = {
            soleTraderDetails: {
                forename: "Jane",
                otherForenames: "Doe",
                surname: "Doe",
                usualResidentialCountry: "US"
            }
        } as AcspFullProfile;
    });

    it("should update soleTraderDetails if changeFlag is true, session data for NAME is null, and names are different", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce("undefined");

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.forename).toBe(acspUpdatedFullProfile.soleTraderDetails!.forename);
        expect(result.soleTraderDetails!.otherForenames).toBe(acspUpdatedFullProfile.soleTraderDetails!.otherForenames);
        expect(result.soleTraderDetails!.surname).toBe(acspUpdatedFullProfile.soleTraderDetails!.surname);
    });

    it("should not update soleTraderDetails if session data for NAME is not null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce("2023-01-01");

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.forename).toBe(acspUpdatedFullProfile.soleTraderDetails!.forename);
        expect(result.soleTraderDetails!.otherForenames).toBe(acspUpdatedFullProfile.soleTraderDetails!.otherForenames);
        expect(result.soleTraderDetails!.surname).toBe(acspUpdatedFullProfile.soleTraderDetails!.surname);
    });

    it("should not update soleTraderDetails if names are the same", () => {
        acspUpdatedFullProfile.soleTraderDetails!.forename = "John";
        acspUpdatedFullProfile.soleTraderDetails!.otherForenames = "Doe";
        acspUpdatedFullProfile.soleTraderDetails!.surname = "Smith";

        (session.getExtraData as jest.Mock).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.forename).toBe("John");
        expect(result.soleTraderDetails!.otherForenames).toBe("Doe");
        expect(result.soleTraderDetails!.surname).toBe("Smith");
    });
});

describe("validateUpdatesWithoutDate", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;
    let acspFullProfile: AcspFullProfile;
    let acspUpdatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn()
        };

        req = {
            session: session as Session
        } as Partial<Request>;

        acspFullProfile = {
            soleTraderDetails: {
                usualResidentialCountry: "UK"
            }
        } as AcspFullProfile;

        acspUpdatedFullProfile = {
            soleTraderDetails: {
                usualResidentialCountry: "US"
            }
        } as AcspFullProfile;
    });

    it("should update usualResidentialCountry if changeFlag is true, session data for WHEREDOYOULIVE is null, and countries are different", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.usualResidentialCountry).toBe(acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry);
    });

    it("should not update usualResidentialCountry if session data for WHEREDOYOULIVE is not null", () => {
        (session.getExtraData as jest.Mock).mockReturnValueOnce("2023-01-01");

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.usualResidentialCountry).toBe(acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry);
    });

    it("should not update usualResidentialCountry if countries are the same", () => {
        acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = "UK";

        (session.getExtraData as jest.Mock).mockReturnValueOnce(null);

        const result = validateUpdatesWithoutDate(req as Request, acspFullProfile, acspUpdatedFullProfile);

        expect(result.soleTraderDetails!.usualResidentialCountry).toBe("UK");
    });
});
