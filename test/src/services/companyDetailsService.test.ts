import { Request } from "express";
import { CompanyDetailsService } from "../../../src/services/company-details/companyDetailsService";
import { getSessionValue, saveDataInSession } from "../../../src/common/__utils/sessionHelper";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { Session } from "@companieshouse/node-session-handler";

describe("CompanyDetailsService", () => {
    let service: CompanyDetailsService;
    let req: MockRequest<Request>;

    beforeEach(() => {
    // initialize service and mock request object
        service = new CompanyDetailsService();
        req = createRequest({
            method: "GET",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    test("saveToSession correctly saves company details to session", () => {
        // mock company details
        const mockCompanyDetails : CompanyProfile = {
            companyName: "Company",
            companyNumber: "12345678",
            companyStatus: "Active",
            companyStatusDetail: "",
            dateOfCreation: "23 February 2023",
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
        const session: Session = req.session as any as Session;

        expect(session.getExtraData(COMPANY_DETAILS)).toEqual({
            companyName: mockCompanyDetails.companyName,
            companyNumber: mockCompanyDetails.companyNumber,
            status: mockCompanyDetails.companyStatus,
            incorporationDate: mockCompanyDetails.dateOfCreation,
            companyType: mockCompanyDetails.type,
            registeredOfficeAddress: mockCompanyDetails.registeredOfficeAddress
        });
    });

    test("getFromSession retrieves company details from session", async () => {
        const mockCompanyDetails : CompanyProfile = {
            companyName: "Company",
            companyNumber: "12345678",
            companyStatus: "Active",
            companyStatusDetail: "",
            dateOfCreation: "23 February 2023",
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
        // req.session = mockCompanyDetails;
        // fetch company details
        saveDataInSession(req, COMPANY_DETAILS, mockCompanyDetails);
        const retrievedDetails = await getSessionValue(req, COMPANY_DETAILS);
        // check company details match mock data
        expect(retrievedDetails).toEqual(mockCompanyDetails);
    });

});
