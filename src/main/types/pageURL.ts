const SEPARATOR = "/";

const SOLE_TRADER = "/sole-trader";
const LIMITED = "/limited";
const UNINCORPORATED = "/unincorporated";

export const BASE_URL = "/register-acsp";
export const SIGN_OUT_PAGE = `signout`;

export const HOME_URL = "/home";
export const COMPANY_BASE_URL = "/company";

export const COMPANY_NUMBER_PAGE = "company/number";
export const COMPANY_NUMBER_URL = `${HOME_URL}/${COMPANY_NUMBER_PAGE}`;

export const SIGN_OUT_URL = `${HOME_URL}/${SIGN_OUT_PAGE}`;

export const START = "/"; // Domain name will go here

export const SOLE_TRADER_SECTOR_YOU_WORK_IN = SOLE_TRADER + "/sector-you-work-in";

export const SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS = SOLE_TRADER + "/correspondence-address-manual";

export const SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM = SOLE_TRADER + "/correspondence-address-confirm";

export const SOLE_TRADER_DATE_OF_BIRTH = SOLE_TRADER + "/date-of-birth";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS = SOLE_TRADER + "/correspondenceAddressAutoLookup";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST = SOLE_TRADER + "/correspondence-address-list";

export const SOLE_TRADER_WHERE_DO_YOU_LIVE = SOLE_TRADER + "/where-do-you-live";

export const SOLE_TRADER_ROLE = SOLE_TRADER + "/statement-relevant-officer";

export const SOLE_TRADER_TYPE_OF_BUSINESS = SOLE_TRADER + "/type-of-business";

export const SOLE_TRADER_OTHER_TYPE_OFBUSINESS = SOLE_TRADER + "/other-type-of-business";

export const SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED = LIMITED + "/how-are-you-aml-supervised";

export const HEALTHCHECK = "/healthcheck";

export const LIMITED_NAME_REGISTERED_WITH_AML = LIMITED + "/name-registered-with-aml";

export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED = LIMITED + "/your-business-must-be-aml-registered";

export const AML_REGISTRATION = "https://www.gov.uk/anti-money-laundering-registration";

export const LIMITED_WHAT_IS_YOUR_ROLE = LIMITED + "/what-is-your-role";

export const YOUR_BUSINESS_MUST_BE_REGISTERED_KICKOUT = LIMITED + "/your-business-must-be-aml-registered";

export const UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME = UNINCORPORATED + "/what-is-the-business-name";

export const LIMITED_COMPANY_INACTIVE = LIMITED + "/company-inactive";

export const LIMITED_WHAT_IS_THE_COMPANY_NUMBER = LIMITED + "what-is-the-company-number";

export const UNINCORPORATED_WHAT_BUSINESS_TYPE = UNINCORPORATED + "/what-business-type";
