export const ACSP_API_LOCALHOST = "http://localhost:18642/acsp-api";
import { getEnvironmentValue } from "../utils/environment/environment_value";

const BASE_VIEWS_URL = "../views/features";
const BASE_SOLE_TRADER_URL = `${BASE_VIEWS_URL}/sole-trader`;
const BASE_LIMITED_TRADER_URL = `${BASE_VIEWS_URL}/limited`;
const BASE_UNINCORPORATED_URL = `${BASE_VIEWS_URL}/unincorporated`;
export const HOME = `${BASE_SOLE_TRADER_URL}/index/home`;
export const SOLE_TRADER_DOB = `${BASE_SOLE_TRADER_URL}/date-of-birth/capture-date-of-birth`;
export const SOLE_TRADER_NAME = `${BASE_SOLE_TRADER_URL}/name/capture-name`;
export const SOLE_TRADER_ROLE = `${BASE_SOLE_TRADER_URL}/role/statement-relevant-officer`;
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
export const LIMITED_NAME_REGISTERED_WITH_AML = `${BASE_LIMITED_TRADER_URL}/name-registered-with-aml/name-registered-with-aml`;
export const LIMITED_BUSINESS_MUSTBE_AML_REGISTERED = `${BASE_LIMITED_TRADER_URL}/business-mustbe-aml-registered/business-mustbe-aml-registered`;
export const UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME = `${BASE_UNINCORPORATED_URL}/what-is-the-business-name/what-is-the-business-name`;
export const LIMITED_COMPANY_INACTIVE = `${BASE_LIMITED_TRADER_URL}/company-inactive/company-inactive`;
export const ACSP_SERVICE_HOST = "localhost";
export const ACSP_SERVICE_PORT = "18644";
export const ACSP_SERVICE_BASE = `${ACSP_SERVICE_HOST}:${ACSP_SERVICE_PORT}/acsp-api`;
export const ACSP_SERVICE_TRANSACTION_URI = `${ACSP_SERVICE_BASE}/transactions`;
export const CREATE_DESCRIPTION = "Create an ACSP registration transaction";
export const REFERENCE = "ACSP Registration";
export const transactionStatuses = {
    CLOSED: "closed"
};
export const LIMITED_COMPANY_NUMBER = `${BASE_LIMITED_TRADER_URL}/company-number/company-number`;
export const LIMITED_IS_THIS_YOUR_COMPANY = `${BASE_LIMITED_TRADER_URL}/is-this-your-company/is-this-your-company`;
