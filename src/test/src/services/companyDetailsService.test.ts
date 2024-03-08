import { Request } from "express";
import { CompanyDetailsService } from "../../../main/services/company-details/companyDetailsService";
import { getSessionValue } from "../../../main/common/__utils/sessionHelper";
import { COMPANY_DETAILS } from "../../../main/common/__utils/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

describe("CompanyDetailsService", () => {
    let service: CompanyDetailsService;
    let req: Request & { session: any };

    beforeEach(() => {
    // initialize service and mock request object
        service = new CompanyDetailsService();
        // req = {} as Request;
        req.session = {} as any; // Mock session object
        // mock the save and method on req.session
        req.session.save = jest.fn().mockImplementation((callback: (err?: any) => void) => {
            if (callback) {
                callback();
            }
        });
    });

    xtest("saveToSession correctly saves company details to session", () => {
        // mock company details
        const mockCompanyDetails : CompanyProfile = {
            companyName: "Company",
            companyNumber: "12345678",
            companyStatus: "Active",
            companyStatusDetail: "",
            dateOfCreation: "2023-02-23",
            jurisdiction: "",
            sicCodes: [""],
            hasBeenLiquidated: false,
            hasSuperSecurePscs: false,
            type: "Private Limited Company",
            hasCharges: false,
            hasInsolvencyHistory: false,
            registeredOfficeAddress: {
                addressLineOne: "456 Secondary Street",
                addressLineTwo: "",
                careOf: "",
                country: "Country",
                locality: "",
                poBox: "",
                postalCode: "54321",
                premises: "",
                region: ""
            },
            serviceAddress: {
                addressLineOne: "456 Secondary Street",
                addressLineTwo: "",
                careOf: "",
                country: "Example Country",
                locality: "",
                poBox: "",
                postalCode: "54321",
                premises: "",
                region: ""
            },
            accounts: {
                nextAccounts: {
                    periodEndOn: "",
                    periodStartOn: ""
                },
                nextDue: "",
                overdue: false
            },
            links: {}
        };
        // call the method to save company details into session
        service.saveToSession(req, mockCompanyDetails);

        expect(req.session.companyDetails).toBeDefined();
        expect(req.session.companyDetails).toEqual({
            companyName: mockCompanyDetails.companyName,
            companyNumber: mockCompanyDetails.companyNumber,
            status: mockCompanyDetails.companyStatus,
            incorporationDate: mockCompanyDetails.dateOfCreation,
            companyType: mockCompanyDetails.type,
            registeredOfficeAddress: mockCompanyDetails.registeredOfficeAddress,
            correspondenceAddress: mockCompanyDetails.serviceAddress
        });
    });

    xtest("getFromSession retrieves company details from session", () => {
        const mockCompanyDetails : CompanyProfile = {
            companyName: "Company",
            companyNumber: "12345678",
            companyStatus: "Active",
            companyStatusDetail: "",
            dateOfCreation: "2023-02-23",
            jurisdiction: "",
            sicCodes: [""],
            hasBeenLiquidated: false,
            hasSuperSecurePscs: false,
            type: "Private Limited Company",
            hasCharges: false,
            hasInsolvencyHistory: false,
            registeredOfficeAddress: {
                addressLineOne: "456 Secondary Street",
                addressLineTwo: "",
                careOf: "",
                country: "Country",
                locality: "",
                poBox: "",
                postalCode: "54321",
                premises: "",
                region: ""
            },
            serviceAddress: {
                addressLineOne: "456 Secondary Street",
                addressLineTwo: "",
                careOf: "",
                country: "Example Country",
                locality: "",
                poBox: "",
                postalCode: "54321",
                premises: "",
                region: ""
            },
            accounts: {
                nextAccounts: {
                    periodEndOn: "",
                    periodStartOn: ""
                },
                nextDue: "",
                overdue: false
            },
            links: {}
        };
        req.session.companyDetails = mockCompanyDetails;
        // fetch company details
        const retrievedDetails = getSessionValue(req, COMPANY_DETAILS);
        // check company details match mock data
        expect(retrievedDetails).toEqual(mockCompanyDetails);
    });

    xtest("clearSession clears company details from session", () => {
        const mockCompanyDetails = {
            company_name: "Company",
            company_number: "12345678",
            company_status: "Active",
            date_of_creation: "2023-02-23",
            type: "Private Limited Company",
            registered_office_address: {
                address_line_1: "123 Main Street",
                city: "City",
                postal_code: "54321",
                country: "Country"
            },
            undeliverable_registered_office_address: "Correspondence Address: 456 Secondary Street, Example City, 54321, Example Country"
        };
        req.session.companyDetails = mockCompanyDetails;
        // clear company details
        // service.clearSession(req);
        // check company details are cleared
        // expect(req.session.companyDetails).toBeUndefined();
    });
});
