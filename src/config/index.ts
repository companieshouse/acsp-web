const BASE_VIEWS_URL = "../views/features";
const BASE_COMMON_URL = `../views/common`;
const BASE_PARTIALS_URL = `../views/partials`;
const BASE_SOLE_TRADER_URL = `${BASE_VIEWS_URL}/sole-trader`;
const BASE_LIMITED_TRADER_URL = `${BASE_VIEWS_URL}/limited`;
const BASE_UNINCORPORATED_URL = `${BASE_VIEWS_URL}/unincorporated`;

export const HOME = `${BASE_COMMON_URL}/index/home`;
export const SOLE_TRADER_DATE_OF_BIRTH = `${BASE_SOLE_TRADER_URL}/what-is-your-date-of-birth/what-is-your-date-of-birth`;
export const SOLE_TRADER_WHERE_DO_YOU_LIVE = `${BASE_SOLE_TRADER_URL}/where-do-you-live/where-do-you-live`;
export const SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY = `${BASE_SOLE_TRADER_URL}/nationality/nationality`;
export const SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME = `${BASE_SOLE_TRADER_URL}/what-is-the-business-name/what-is-the-business-name`;

export const LIMITED_NAME_REGISTERED_WITH_AML = `${BASE_LIMITED_TRADER_URL}/name-registered-with-aml/name-registered-with-aml`;
export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED = `${BASE_LIMITED_TRADER_URL}/business-mustbe-aml-registered/business-mustbe-aml-registered`;
export const LIMITED_COMPANY_INACTIVE = `${BASE_LIMITED_TRADER_URL}/company-inactive/company-inactive`;
export const LIMITED_COMPANY_NUMBER = `${BASE_LIMITED_TRADER_URL}/company-number/company-number`;
export const LIMITED_IS_THIS_YOUR_COMPANY = `${BASE_LIMITED_TRADER_URL}/is-this-your-company/is-this-your-company`;

export const UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP = `${BASE_UNINCORPORATED_URL}/business-address-auto-lookup/auto-lookup-address`;
export const UNINCORPORATED_BUSINESS_ADDRESS_LIST = `${BASE_UNINCORPORATED_URL}/business-address-auto-lookup/business-address-list`;
export const UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY = `${BASE_UNINCORPORATED_URL}/business-address-manual-entry/business-address-manual-entry`;
export const UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM = `${BASE_UNINCORPORATED_URL}/confirm-your-business-address/confirm-your-business-address`;

export const CREATE_DESCRIPTION = "Application to register a Companies House authorised agent";
export const REFERENCE = "ACSP Registration";
export const transactionStatuses = {
    CLOSED: "closed",
    CLOSED_PENDING_PAYMENT: "closed pending payment"
};
export const PAYMENTS = "/payments";
export const ACCESSIBILITY_STATEMENT = `${BASE_COMMON_URL}/accessibility-statement/accessibility-statement`;
export const STOP_NOT_RELEVANT_OFFICER = `${BASE_SOLE_TRADER_URL}/stop-not-relevant-officer/stop-not-relevant-officer`;
export const WHAT_IS_YOUR_NAME = `${BASE_COMMON_URL}/name/capture-name`;
export const NAME_REGISTERED_WITH_AML = `${BASE_COMMON_URL}/name-registered-with-aml/name-registered-with-aml`;
export const WHAT_IS_YOUR_ROLE = `${BASE_COMMON_URL}/what-is-your-role/what-is-your-role`;
export const STOP_NOT_RELEVANT_OFFICER_KICK_OUT = `${BASE_COMMON_URL}/stop-not-relevant-officer/stop-not-relevant-officer`;
export const SECTOR_YOU_WORK_IN = `${BASE_COMMON_URL}/sector-you-work-in/sector-you-work-in`;
export const WHICH_SECTOR_OTHER = `${BASE_COMMON_URL}/which-sector-other/which-sector-other`;
export const AUTO_LOOKUP_ADDRESS = `${BASE_COMMON_URL}/correspondence-auto-lookup-address/auto-lookup-address`;
export const CORRESPONDENCE_ADDRESS_LIST = `${BASE_COMMON_URL}/correspondence-auto-lookup-address/correspondence-address-list`;
export const SIGN_OUT_PAGE = `${BASE_COMMON_URL}/sign-out-page/sign-out`;
export const SAVED_APPLICATION = `${BASE_COMMON_URL}/saved-application/saved-application`;

export const ERROR_400 = `${BASE_PARTIALS_URL}/error_400`;
export const ERROR_404 = `${BASE_PARTIALS_URL}/error_404`;
export const ERROR_500 = `${BASE_PARTIALS_URL}/error_500`;
export const ERROR_403 = `${BASE_PARTIALS_URL}/error_403`;

export const SELECT_AML_SUPERVISOR = `${BASE_COMMON_URL}/select-aml-supervisory-bodies/select-aml-supervisory-bodies`;
export const CHECK_YOUR_ANSWERS = `${BASE_COMMON_URL}/check-your-answers/check-your-answers`;
export const APPLICATION_CONFIRMATION = `${BASE_COMMON_URL}/application-confirmation/application-confirmation`;
export const YOUR_RESPONSIBILITIES = `${BASE_COMMON_URL}/your-responsibilities/your-responsibilities`;
export const CORRESPONDENCE_ADDRESS_MANUAL = `${BASE_COMMON_URL}/correspondence-address-manual/capture-correspondence-address-manual`;
export const CORRESPONDENCE_ADDRESS_CONFIRM = `${BASE_COMMON_URL}/correspondence-address-confirm/correspondence-address-confirm`;
export const WHAT_IS_THE_BUSINESS_NAME = `${BASE_COMMON_URL}/what-is-the-business-name/what-is-the-business-name`;
export const AML_MEMBERSHIP_NUMBER = `${BASE_COMMON_URL}/aml-body-number/aml-body-number`;
export const ADDRESS_CORRESPONDANCE_SELECTOR = `${BASE_COMMON_URL}/address-correspondance-selector/address-correspondance-selector`;
export const TYPE_OF_BUSINESS = `${BASE_COMMON_URL}/type-of-business/type-of-business`;
export const OTHER_TYPE_OF_BUSINESS = `${BASE_COMMON_URL}/other-type-of-business/other-type-of-business`;
export const CHECK_AML_DETAILS = `${BASE_COMMON_URL}/check-aml-details/check-aml-details`;
export const CANNOT_SUBMIT_ANOTHER_APPLICATION = `${BASE_COMMON_URL}/cannot-submit-another-application/cannot-submit-another-application`;
export const WHAT_IS_YOUR_EMAIL = `${BASE_COMMON_URL}/what-is-your-email/what-is-your-email`;
export const CANNOT_REGISTER_AGAIN = `${BASE_COMMON_URL}/cannot-register-again/cannot-register-again`;
export const PAYMENT_FAILED = `${BASE_COMMON_URL}/payment-failed/payment-failed`;

// update acsp details configs
const BASE_UPDATE_ACSP_DETAILS_URL = `${BASE_VIEWS_URL}/update-acsp-details`;

export const UPDATE_ACSP_DETAILS_HOME = `${BASE_UPDATE_ACSP_DETAILS_URL}/index/home`;
export const UPDATE_YOUR_ANSWERS = `${BASE_UPDATE_ACSP_DETAILS_URL}/update-your-details`;
export const UPDATE_WHAT_IS_YOUR_EMAIL = `${BASE_UPDATE_ACSP_DETAILS_URL}/what-is-your-email/what-is-your-email`;
export const UPDATE_ACSP_DETAILS_APPLICATION_CONFIRMATION = `${BASE_UPDATE_ACSP_DETAILS_URL}/application-confirmation/application-confirmation`;
export const UPDATE_ADD_AML_SUPERVISORY_BODY = `${BASE_UPDATE_ACSP_DETAILS_URL}/add-aml-supervisory-body/add-aml-supervisory-body`;
export const UPDATE_CANCEL_ALL_UPDATES = `${BASE_UPDATE_ACSP_DETAILS_URL}/cancel-all-updates/cancel-all-updates`;
export const UPDATE_DATE_OF_THE_CHANGE = `${BASE_UPDATE_ACSP_DETAILS_URL}/date-of-the-change/date-of-the-change`;
export const UPDATE_PROVIDE_AML_DETAILS = `${BASE_UPDATE_ACSP_DETAILS_URL}/provide-aml-details/provide-aml-details`;
export const UPDATE_CHECK_YOUR_UPDATES = `${BASE_UPDATE_ACSP_DETAILS_URL}/your-updates/your-updates`;

// closed acsp configs
const BASE_CLOSE_ACSP_URL = `${BASE_VIEWS_URL}/close-acsp`;

export const CLOSE_ACSP_HOME = `${BASE_CLOSE_ACSP_URL}/index/home`;
export const CLOSE_WHAT_WILL_HAPPEN = `${BASE_CLOSE_ACSP_URL}/what-will-happen/what-will-happen`;
export const CLOSE_CONFIRM_YOU_WANT_TO_CLOSE = `${BASE_CLOSE_ACSP_URL}/confirm-you-want-to-close/confirm-you-want-to-close`;
