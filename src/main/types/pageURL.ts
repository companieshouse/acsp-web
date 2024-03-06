const SEPARATOR = "/";

export const START = "/"; // Domain name will go here

export const HOME_URL = "/home";

export const SIGN_OUT_PAGE = `signout`;

export const SIGN_OUT_URL = `${HOME_URL}/${SIGN_OUT_PAGE}`;

export const COMPANY_BASE_URL = "/company";

export const COMPANY_NUMBER_PAGE = "company/number";

export const COMPANY_NUMBER_URL = `${HOME_URL}/${COMPANY_NUMBER_PAGE}`;

export const HEALTHCHECK = "/healthcheck";

export const BASE_URL = "/register-acsp";

export const SOLE_TRADER = "/sole-trader";

const LIMITED = "/limited";

const UNINCORPORATED = "/unincorporated";

export const TYPE_OF_BUSINESS = "/what-business-type";

export const OTHER_TYPE_OFBUSINESS = "/what-other-business-type";

export const STOP_NOT_RELEVANT_OFFICER = "/cannot-use-service";

export const ACCESSIBILITY_STATEMENT = "/accessibility-statement";

// sole trader journey urls
export const SOLE_TRADER_WHAT_IS_YOUR_ROLE = SOLE_TRADER + "/what-is-your-role";

export const SOLE_TRADER_WHAT_IS_YOUR_NAME = SOLE_TRADER + "/what-is-your-name";

export const SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME = SOLE_TRADER + "/what-is-the-business-name";

export const SOLE_TRADER_DATE_OF_BIRTH = SOLE_TRADER + "/what-is-your-date-of-birth";

export const SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY = SOLE_TRADER + "/what-is-your-nationality";

export const SOLE_TRADER_WHERE_DO_YOU_LIVE = SOLE_TRADER + "/where-do-you-live";

export const SOLE_TRADER_SECTOR_YOU_WORK_IN = SOLE_TRADER + "/which-sector";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS = SOLE_TRADER + "/correspondence-address-lookup";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST = SOLE_TRADER + "/select-your-correspondence-address";

export const SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS = SOLE_TRADER + "/correspondence-address-manual-entry";

export const SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM = SOLE_TRADER + "/confirm-your-correspondence-address";

export const SOLE_TRADER_NAME_REGISTERED_WITH_AML = SOLE_TRADER + "/name-registered-with-aml";

export const SOLE_TRADER_SELECT_AML_SUPERVISOR = SOLE_TRADER + "/select-aml-supervisor";

// limited journey urls
export const LIMITED_ONE_LOGIN_PASSWORD = LIMITED + "/one-login-enter-password";

export const LIMITED_WHAT_IS_THE_COMPANY_NUMBER = LIMITED + "/what-is-the-company-number";

export const LIMITED_IS_THIS_YOUR_COMPANY = LIMITED + "/is-this-your-company";

export const LIMITED_COMPANY_INACTIVE = LIMITED + "/company-inactive";

export const LIMITED_WHAT_IS_YOUR_ROLE = LIMITED + "/what-is-your-role";

export const LIMITED_NAME_REGISTERED_WITH_AML = LIMITED + "/name-registered-with-aml";

export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT = LIMITED + "/your-business-must-be-aml-registered";

export const AML_REGISTRATION = "https://www.gov.uk/anti-money-laundering-registration";

export const SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED = LIMITED + "/how-are-you-aml-supervised";

// unincorporated journey urls
export const UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME = UNINCORPORATED + "/what-is-the-business-name";

export const UNINCORPORATED_NAME_REGISTERED_WITH_AML = UNINCORPORATED + "/name-registered-with-aml";
