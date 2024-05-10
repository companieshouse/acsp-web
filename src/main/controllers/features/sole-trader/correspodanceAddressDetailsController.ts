import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { ADDRESS_LIST, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { Address } from "main/model/Address";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AddressLookUpService } from "../../../../main/services/address/addressLookUp";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    const session: Session = req.session as any as Session;
    const addressList = session.getExtraData(ADDRESS_LIST);
    // const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
    // const acspData: ACSPData = session.getExtraData(USER_DATA)!;
    // const acsp: Acsp = {
    //     firstName: acspData?.firstName,
    //     lastName: acspData?.lastName!
    //     // id: acspData.id,
    //     // addresses: acspData?.addressList,
    //     // typeOfBusiness: acspData.typeOfBusiness!
    // };
    res.render(config.CORRESPONDENCE_ADDRESS_LIST, {
        title: "Select the correspondence address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        addresses: addressList,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
    }
    );
};

export const post = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);

        const session: Session = req.session as any as Session;
        const addressList: Address[] = session.getExtraData(ADDRESS_LIST)!;
        const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_LIST, {
                title: "Select the correspondence address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                addresses: addressList,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang),
                pageProperties: pageProperties
            });
        } else {
            const selectPremise = req.body.correspondenceAddress;
            // Save selected address to the session
            const correspondenceAddress: Address = addressList.filter((address) => address.propertyDetails === selectPremise)[0];
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.saveCorrespondenceAddressFromList(req, correspondenceAddress);

            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};
