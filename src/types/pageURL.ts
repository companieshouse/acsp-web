import { ACCOUNT_URL, CHS_URL } from "../utils/properties";

const SEPARATOR = "/";

export const START = "/"; // Domain name will go here

export const HOME_URL = "";

export const SIGN_OUT_PAGE = `signout`;

export const SIGN_OUT_URL = `/${SIGN_OUT_PAGE}`;

export const ACCOUNTS_SIGNOUT_PATH = `${ACCOUNT_URL}/signout`;

export const COMPANY_BASE_URL = "/company";

export const COMPANY_NUMBER_PAGE = "company/number";

export const COMPANY_NUMBER_URL = `/${COMPANY_NUMBER_PAGE}`;

export const HEALTHCHECK = "/healthcheck";

export const BASE_URL = "/register-as-companies-house-authorised-agent";

export const SOLE_TRADER = "/sole-trader";

const LIMITED = "/limited";

const UNINCORPORATED = "/unincorporated";

export const TYPE_OF_BUSINESS = "/what-business-type";

export const OTHER_TYPE_OF_BUSINESS = "/what-other-business-type";

export const STOP_NOT_RELEVANT_OFFICER = "/cannot-use-service";

export const STOP_NOT_ACCOUNT_OWNER = "/stop-screen-not-owner";

export const ACCESSIBILITY_STATEMENT = "/accessibility-statement";

export const AML_MEMBERSHIP_NUMBER = "/aml-membership-number";

export const AML_BODY_DETAILS_CONFIRM = "/confirm-aml-details";

export const CHECK_YOUR_ANSWERS = "/check-your-answers";

export const PAYMENT_CALLBACK_URL = "/payment-callback";

export const CONFIRMATION = "/application-complete";

export const YOUR_RESPONSIBILITIES = "/your-responsibilities";

export const SAVED_APPLICATION = "/saved-application";

export const YOUR_FILINGS = `${CHS_URL}/user/transactions`;

export const CHECK_SAVED_APPLICATION = "/check-saved-application";

export const CANNOT_SUBMIT_ANOTHER_APPLICATION = "/cannot-submit-another-application";

export const CANNOT_REGISTER_AGAIN = "/cannot-register-again";

export const AUTHORISED_AGENT = `${CHS_URL}/authorised-agent`;

export const MANAGE_USERS = `${AUTHORISED_AGENT}/manage-users`;

export const IDENTITY_VERIFICATION = "identity-verification";

export const VERIFY_IDENTITY_WITH_GOV_UK_ONE_LOGIN = `${ACCOUNT_URL}/${IDENTITY_VERIFICATION}/direct/has-identity-been-verified`;

export const STRIKE_OFF_YOUR_COMPANY = "https://www.gov.uk/strike-off-your-company-from-companies-register/close-down-your-company";

export const TELL_HMRC_YOUVE_STOPPED_TRADING = "https://www.gov.uk/stop-being-self-employed";

export const REGISTRATION_FEEDBACK_LINK = "https://www.smartsurvey.co.uk/s/reg-as-acsp-fdbk/";

export const MUST_BE_AUTHORISED_AGENT = "/must-be-authorised-agent";

// sole trader journey urls
export const SOLE_TRADER_WHAT_IS_YOUR_ROLE = SOLE_TRADER + "/what-is-your-role";

export const SOLE_TRADER_WHAT_IS_YOUR_NAME = SOLE_TRADER + "/what-is-your-name";

export const SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME = SOLE_TRADER + "/what-is-the-business-name";

export const SOLE_TRADER_DATE_OF_BIRTH = SOLE_TRADER + "/what-is-your-date-of-birth";

export const SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY = SOLE_TRADER + "/what-is-your-nationality";

export const SOLE_TRADER_WHERE_DO_YOU_LIVE = SOLE_TRADER + "/where-do-you-live";

export const SOLE_TRADER_SECTOR_YOU_WORK_IN = SOLE_TRADER + "/which-sector";

export const SOLE_TRADER_WHICH_SECTOR_OTHER = SOLE_TRADER + "/which-sector-other";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS = SOLE_TRADER + "/correspondence-address-lookup";

export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST = SOLE_TRADER + "/select-your-correspondence-address";

export const SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS = SOLE_TRADER + "/correspondence-address-manual-entry";

export const SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM = SOLE_TRADER + "/confirm-your-correspondence-address";

export const SOLE_TRADER_NAME_REGISTERED_WITH_AML = SOLE_TRADER + "/name-registered-with-aml";

export const SOLE_TRADER_SELECT_AML_SUPERVISOR = SOLE_TRADER + "/select-aml-supervisor";

export const SOLE_TRADER_WHAT_IS_YOUR_EMAIL = SOLE_TRADER + "/what-email-should-we-use";

// limited journey urls
export const LIMITED_ONE_LOGIN_PASSWORD = LIMITED + "/one-login-enter-password";

export const LIMITED_WHAT_IS_THE_COMPANY_NUMBER = LIMITED + "/what-is-the-company-number";

export const LIMITED_IS_THIS_YOUR_COMPANY = LIMITED + "/is-this-your-company";

export const LIMITED_COMPANY_INACTIVE = LIMITED + "/company-inactive";

export const LIMITED_WHAT_IS_THE_COMPANY_AUTH_CODE = LIMITED + "/what-is-the-company-authentication-code";

export const LIMITED_WHAT_IS_YOUR_ROLE = LIMITED + "/what-is-your-role";

export const LIMITED_NAME_REGISTERED_WITH_AML = LIMITED + "/name-registered-with-aml";

export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT = LIMITED + "/your-business-must-be-aml-registered";

export const AML_REGISTRATION = "https://www.gov.uk/anti-money-laundering-registration";

export const LIMITED_SECTOR_YOU_WORK_IN = LIMITED + "/which-sector";

export const LIMITED_WHICH_SECTOR_OTHER = LIMITED + "/which-sector-other";

export const LIMITED_SELECT_AML_SUPERVISOR = LIMITED + "/select-aml-supervisor";

export const LIMITED_CORRESPONDENCE_ADDRESS_MANUAL = LIMITED + "/correspondence-address-manual-entry";

export const LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP = LIMITED + "/correspondence-address-lookup";

export const LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM = LIMITED + "/confirm-your-correspondence-address";

export const LIMITED_CORRESPONDENCE_ADDRESS_LIST = LIMITED + "/select-your-correspondence-address";

export const LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS = LIMITED + "/what-is-the-correspondence-address";

export const LIMITED_WHAT_IS_YOUR_EMAIL = LIMITED + "/what-email-should-we-use";

// unincorporated journey urls
export const UNINCORPORATED_NAME_REGISTERED_WITH_AML = UNINCORPORATED + "/name-registered-with-aml";

export const UNINCORPORATED_WHAT_IS_YOUR_NAME = UNINCORPORATED + "/what-is-your-name";

export const UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME = UNINCORPORATED + "/what-is-the-business-name";

export const UNINCORPORATED_WHAT_IS_YOUR_ROLE = UNINCORPORATED + "/what-is-your-role";

export const UNINCORPORATED_WHICH_SECTOR = UNINCORPORATED + "/which-sector";

export const UNINCORPORATED_WHICH_SECTOR_OTHER = UNINCORPORATED + "/which-sector-other";

export const UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP = UNINCORPORATED + "/business-address-lookup";

export const UNINCORPORATED_BUSINESS_ADDRESS_MANUAL = UNINCORPORATED + "/business-address-manual-entry";

export const UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM = UNINCORPORATED + "/confirm-your-business-address";

export const UNINCORPORATED_BUSINESS_ADDRESS_LIST = UNINCORPORATED + "/select-your-business-address";

export const UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS = UNINCORPORATED + "/what-is-the-correspondence-address";

export const UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL = UNINCORPORATED + "/correspondence-address-manual-entry";

export const UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM = UNINCORPORATED + "/confirm-your-correspondence-address";

export const UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP = UNINCORPORATED + "/correspondence-address-lookup";

export const UNINCORPORATED_SELECT_AML_SUPERVISOR = UNINCORPORATED + "/select-aml-supervisor";

export const UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST = UNINCORPORATED + "/select-your-correspondence-address";

export const UNINCORPORATED_WHAT_IS_YOUR_EMAIL = UNINCORPORATED + "/what-email-should-we-use";

export const RESUME_JOURNEY = "/resume";

export const PAYMENT_FAILED = "/payment-failed";

// update acsp details urls

export const UPDATE_ACSP_DETAILS_BASE_URL = "/view-and-update-the-authorised-agents-details";

export const UPDATE_ACSP_WHAT_IS_YOUR_NAME = "/what-is-your-name";

export const UPDATE_YOUR_ANSWERS = "/view-authorised-agent-details";

export const UPDATE_WHERE_DO_YOU_LIVE = "/where-do-you-live";

export const UPDATE_CORRESPONDENCE_ADDRESS_MANUAL = "/enter-correspondence-address";

export const UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP = "/what-is-the-correspondence-address";

export const UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM = "/confirm-correspondence-address";

export const UPDATE_CORRESPONDENCE_ADDRESS_LIST = "/select-correspondence-address";

export const UPDATE_WHAT_IS_THE_BUSINESS_NAME = "/name-of-business";

export const UPDATE_WHAT_IS_THE_COMPANY_NAME = "/what-is-the-company-name";

export const UPDATE_WHAT_IS_YOUR_EMAIL = "/correspondence-email-address";

export const UPDATE_BUSINESS_ADDRESS_MANUAL = "/enter-the-registered-office-address";

export const UPDATE_BUSINESS_ADDRESS_LOOKUP = "/what-is-the-registered-office-address";

export const UPDATE_BUSINESS_ADDRESS_CONFIRM = "/confirm-registered-office-address";

export const UPDATE_BUSINESS_ADDRESS_LIST = "/select-registered-office-address";

export const UPDATE_APPLICATION_CONFIRMATION = "/authorised-agent-update-submitted";

export const CANCEL_AN_UPDATE = "/cancel-an-update";

export const UPDATE_ADD_AML_SUPERVISOR = "/which-aml-supervisory-body-are-you-registered-with";

export const UPDATE_AML_MEMBERSHIP_NUMBER = "/aml-membership-number";

export const REMOVE_AML_SUPERVISOR = "/remove-an-aml";

export const UPDATE_CANCEL_ALL_UPDATES = "/cancel-all-updates";

export const UPDATE_DATE_OF_THE_CHANGE = "/when-did-this-change";

export const UPDATE_PROVIDE_AML_DETAILS = "/add-aml-details";

export const UPDATE_CHECK_YOUR_UPDATES = "/your-updates";

export const UPDATE_FEEDBACK_LINK = "https://www.smartsurvey.co.uk/s/updateacsp-fdbk/";

// close acsp urls

export const CLOSE_ACSP_BASE_URL = "/close-authorised-agent";

export const CLOSE_WHAT_WILL_HAPPEN = "/what-happens-when-you-close";

export const CLOSE_CONFIRM_YOU_WANT_TO_CLOSE = "/confirm-you-want-to-close";

export const CLOSE_CONFIRMATION_ACSP_CLOSED = "/confirmation-authorised-agent-closed";

export const CLOSE_FEEDBACK_LINK = "https://www.smartsurvey.co.uk/s/closeauthagentacct-fdbk/";

export const CLOSE_FEEDBACK_LINK_CONFIRMATION = "https://www.smartsurvey.co.uk/s/closeauthagentacct-conf/";
