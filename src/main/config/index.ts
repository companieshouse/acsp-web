const BASE_VIEWS_URL = "../views/features";
const BASE_SOLE_TRADER_URL = `${BASE_VIEWS_URL}/sole-trader`;
const BASE_LIMITED_TRADER_URL = `${BASE_VIEWS_URL}/limited`;
const BASE_UNINCORPORATED_URL = `${BASE_VIEWS_URL}/unincorporated`;
const BASE_COMMON_URL = `${BASE_VIEWS_URL}/common`;

export const HOME = `${BASE_SOLE_TRADER_URL}/index/home`;
export const SOLE_TRADER_DATE_OF_BIRTH = `${BASE_SOLE_TRADER_URL}/what-is-your-date-of-birth/what-is-your-date-of-birth`;
export const SOLE_TRADER_WHAT_IS_YOUR_ROLE = `${BASE_SOLE_TRADER_URL}/role/what-is-your-role`;
export const SOLE_TRADER_KICK_OUT = `${BASE_SOLE_TRADER_URL}/kick-out/stop-not-relevant-officer`;
export const SOLE_TRADER_SECTOR_YOU_WORK_IN = `${BASE_SOLE_TRADER_URL}/sector-you-work-in/sector-you-work-in`;
export const SOLE_TRADER_WHERE_DO_YOU_LIVE = `${BASE_SOLE_TRADER_URL}/where-do-you-live/where-do-you-live`;
export const SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS = `${BASE_SOLE_TRADER_URL}/correspondence-address-manual/capture-correspondence-address-manual`;
export const SOLE_TRADER_AUTO_LOOKUP_ADDRESS = `${BASE_SOLE_TRADER_URL}/correspondence-auto-lookup-address/auto-lookup-address`;
export const SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST = `${BASE_SOLE_TRADER_URL}/correspondence-auto-lookup-address/correspondence-address-list`;
export const SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM = `${BASE_SOLE_TRADER_URL}/correspondence-address-confirm/correspondence-address-confirm`;
export const SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY = `${BASE_SOLE_TRADER_URL}/nationality/nationality`;
export const SOLE_TRADER_TYPE_OF_BUSINESS = `${BASE_SOLE_TRADER_URL}/type-of-business/type-of-business`;
export const SOLE_TRADER_OTHER_TYPE_OFBUSINESS = `${BASE_SOLE_TRADER_URL}/other-type-of-business/other-type-of-business`;
export const SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME = `${BASE_SOLE_TRADER_URL}/what-is-the-business-name/what-is-the-business-name`;

export const LIMITED_NAME_REGISTERED_WITH_AML = `${BASE_LIMITED_TRADER_URL}/name-registered-with-aml/name-registered-with-aml`;
export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED = `${BASE_LIMITED_TRADER_URL}/business-mustbe-aml-registered/business-mustbe-aml-registered`;
export const UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME = `${BASE_UNINCORPORATED_URL}/what-is-the-business-name/what-is-the-business-name`;
export const LIMITED_COMPANY_INACTIVE = `${BASE_LIMITED_TRADER_URL}/company-inactive/company-inactive`;
export const LIMITED_COMPANY_NUMBER = `${BASE_LIMITED_TRADER_URL}/company-number/company-number`;
export const LIMITED_IS_THIS_YOUR_COMPANY = `${BASE_LIMITED_TRADER_URL}/is-this-your-company/is-this-your-company`;

export const ACSP_SERVICE_HOST = "http://chs.local";
export const ACSP_SERVICE_PORT = "18644";
export const ACSP_SERVICE_BASE = `${ACSP_SERVICE_HOST}/acsp-api`;
export const CREATE_DESCRIPTION = "Create an ACSP registration transaction";
export const REFERENCE = "ACSP Registration";
export const transactionStatuses = {
    CLOSED: "closed"
};
export const ACCESSIBILITY_STATEMENT = `${BASE_VIEWS_URL}/accessibility-statement/accessibility-statement`;
export const STOP_NOT_RELEVANT_OFFICER = `${BASE_SOLE_TRADER_URL}/stop-not-relevant-officer/stop-not-relevant-officer`;
export const WHAT_IS_YOUR_NAME = `${BASE_COMMON_URL}/name/capture-name`;
export const NAME_REGISTERED_WITH_AML = `${BASE_COMMON_URL}/name-registered-with-aml/name-registered-with-aml`;
