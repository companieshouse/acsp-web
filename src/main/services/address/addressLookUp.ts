import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ADDRESS_LIST, USER_DATA, COMPANY_DETAILS } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { ACSPData } from "../../model/ACSPData";
import { Address } from "../../model/Address";
import { Company } from "../../model/Company";
import { getAddressFromPostcode } from "../../services/postcode-lookup-service";
import { getCountryFromKey } from "../../utils/web";
import { addLangToUrl } from "../../utils/localise";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST } from "../../types/pageURL";

export class AddressLookUpService {

    public async saveBusinessAddressToSession (req: Request, ukAddresses: UKAddress[], inputPremise: string): Promise<void> {

        const address: Address = this.getAddress(ukAddresses, inputPremise);
        // Save the address to session
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };
        const acspCompanyDetails: Company = acspData?.companyDetails ? acspData.companyDetails : {
            companyName: "",
            companyNumber: "",
            status: "",
            incorporationDate: "",
            companyType: "",
            registeredOfficeAddress: {}
        };

        acspData.businessAddress = address;
        acspData.companyDetails = acspCompanyDetails;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public async saveCorrespondenceAddressToSession (req: Request, ukAddresses: UKAddress[], inputPremise: string): Promise<void> {

        const address: Address = this.getAddress(ukAddresses, inputPremise);
        // Save the address to session
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };

        acspData.address = address;
        saveDataInSession(req, USER_DATA, acspData);
    }

    private getAddress (ukAddresses: UKAddress[], inputPremise: string) {
        let address: Address = {
            propertyDetails: "",
            line1: "",
            line2: "",
            town: "",
            country: "",
            postcode: ""
        };
        for (const ukAddress of ukAddresses) {
            if (ukAddress.premise === inputPremise) {
                address = {
                    propertyDetails: ukAddress.premise,
                    line1: ukAddress.addressLine1,
                    line2: ukAddress.addressLine2!,
                    town: ukAddress.postTown,
                    country: getCountryFromKey(ukAddress.country),
                    postcode: ukAddress.postcode
                };
            }
        }
        return address;
    }

    public saveAddressListToSession (req: Request, ukAddresses: UKAddress[]): void {

        const addressList : Array<Address> = [];
        for (const ukAddress of ukAddresses) {
            const address = {
                propertyDetails: ukAddress.premise,
                line1: ukAddress.addressLine1,
                line2: ukAddress.addressLine2,
                town: ukAddress.postTown,
                country: getCountryFromKey(ukAddress.country),
                postcode: ukAddress.postcode,
                formattedAddress: ukAddress.premise + ", " + ukAddress.addressLine1 + ", " + ukAddress.postTown + ", " + getCountryFromKey(ukAddress.country) + ", " + ukAddress.postcode
            };

            addressList.push(address);

        }
        // Save the list of addresses to the session
        saveDataInSession(req, ADDRESS_LIST, addressList);
    }

    public saveBusinessAddressFromList (req: Request, businessAddress: Address): void {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };
        const acspCompanyDetails: Company = acspData?.companyDetails ? acspData.companyDetails : {
            companyName: "",
            companyNumber: "",
            status: "",
            incorporationDate: "",
            companyType: "",
            registeredOfficeAddress: {}
        };

        acspData.businessAddress = businessAddress;
        acspData.companyDetails = acspCompanyDetails;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public saveCorrespondenceAddressFromList (req: Request, correspondenceAddress: Address): void {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };
        acspData.address = correspondenceAddress;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public async handleAddressLookup (req: Request, res: Response, lang: string, pageUrl: string): Promise<string> {
        const postcode = req.body.postCode;
        const inputPremise = req.body.premise;
        getAddressFromPostcode(postcode).then((ukAddresses) => {
     
        const session: Session = req.session as any as Session;
        const addressLookUpService = new AddressLookUpService();
        let redirectUrl = "";
        if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
            if (pageUrl === "BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP") {
                redirectUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM;
                addressLookUpService.saveCorrespondenceAddressToSession(req, ukAddresses, inputPremise);
            } else if (pageUrl === "BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP") {
                redirectUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL;
                addressLookUpService.saveBusinessAddressToSession(req, ukAddresses, inputPremise);
            } else {
                redirectUrl = BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS;
                addressLookUpService.saveCorrespondenceAddressToSession(req, ukAddresses, inputPremise);
            }
            // addressLookUpService.saveBusinessAddressToSession(req, ukAddresses, inputPremise);
            res.redirect(redirectUrl);
        } else {
            if (pageUrl === "BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP") {
                redirectUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST;
            } else if (pageUrl === "BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP") {
                redirectUrl = BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST;
            } else {
                redirectUrl = BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST;
            }
            addressLookUpService.saveAddressListToSession(req, ukAddresses);
            redirectUrl = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST;
        }
        const nextPageUrl = addLangToUrl(redirectUrl, lang);
        return nextPageUrl;
    }

};
