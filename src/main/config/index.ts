import { getEnvironmentValue } from "../utils/environment/environment_value";

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

export const ACSP_SERVICE_HOST = "http://chs.local";
export const ACSP_SERVICE_PORT = "18644";
export const ACSP_SERVICE_BASE = `${ACSP_SERVICE_HOST}/acsp-api`;
export const CREATE_DESCRIPTION = "Create an ACSP registration transaction";
export const REFERENCE = "ACSP Registration";
export const transactionStatuses = {
    CLOSED: "closed"
};
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

export const ERROR_404 = `${BASE_PARTIALS_URL}/error_400`;

export const PIWIK_URL = getEnvironmentValue("PIWIK_URL");
export const PIWIK_SITE_ID = getEnvironmentValue("PIWIK_SITE_ID");
export const PIWIK_START_GOAL_ID = getEnvironmentValue("PIWIK_START_GOAL_ID");

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
