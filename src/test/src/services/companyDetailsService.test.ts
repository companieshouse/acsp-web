import { Request } from "express";
import { CompanyDetailsService } from "../../../main/services/company-details/companyDetailsService";

describe("CompanyDetailsService", () => {
    let service: CompanyDetailsService;
    let req: Request & { session: any };

    beforeEach(() => {
    // initialize service and mock request object
        service = new CompanyDetailsService();
        req = {} as Request;
        req.session = {} as any; // Mock session object
        // mock the save and method on req.session
        req.session.save = jest.fn().mockImplementation((callback: (err?: any) => void) => {
            if (callback) {
                callback();
            }
        });
    });

    test("saveToSession correctly saves company details to session", () => {
    // mock company details
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
        // call the method to save company details into session
        service.saveToSession(req, mockCompanyDetails);

        expect(req.session.companyDetails).toBeDefined();
        expect(req.session.companyDetails).toEqual({
            companyName: mockCompanyDetails.company_name,
            companyNumber: mockCompanyDetails.company_number,
            status: mockCompanyDetails.company_status,
            incorporationDate: mockCompanyDetails.date_of_creation,
            companyType: mockCompanyDetails.type,
            registeredOfficeAddress: mockCompanyDetails.registered_office_address,
            correspondenceAddress: mockCompanyDetails.undeliverable_registered_office_address
        });
    });

    test("getFromSession retrieves company details from session", () => {
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
        // fetch company details
        const retrievedDetails = service.getFromSession(req);
        // check company details match mock data
        expect(retrievedDetails).toEqual(mockCompanyDetails);
    });

    test("clearSession clears company details from session", () => {
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
        service.clearSession(req);
        // check company details are cleared
        expect(req.session.companyDetails).toBeUndefined();
    });
});
