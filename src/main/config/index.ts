import { getEnvironmentValue } from "../common/__utils/environment/environment_value";

const BASE_VIEWS_URL = "../views/features";
const BASE_SOLE_TRADER_URL = `${BASE_VIEWS_URL}/sole-trader`;
export const HOME = `${BASE_SOLE_TRADER_URL}/index/home`;
export const SOLE_TRADER_DOB = `${BASE_SOLE_TRADER_URL}/date-of-birth/capture-date-of-birth`;
export const SOLE_TRADER_NAME = `${BASE_SOLE_TRADER_URL}/name/capture-name`;
export const SOLE_TRADER_ROLE = `${BASE_SOLE_TRADER_URL}/role/statement-relevant-officer`;
export const SOLE_TRADER_KICK_OUT = `${BASE_SOLE_TRADER_URL}/kick-out/stop-not-relevant-officer`;
export const SOLE_TRADER_SECTOR_YOU_WORK_IN = `${BASE_SOLE_TRADER_URL}/sector-you-work-in/sector-you-work-in`;
export const SOLE_TRADER_WHERE_DO_YOU_LIVE = `${BASE_SOLE_TRADER_URL}/where-do-you-live/where-do-you-live`;
export const SOLE_TRADER_MANUAL_CORRESPONDANCE_ADDRESS = `${BASE_SOLE_TRADER_URL}/correspondance-address-manual/capture-correspondance-address-manual`;
export const SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY = `${BASE_SOLE_TRADER_URL}/nationality/nationality`;
export const ACSP_SERVICE_HOST = "localhost";
export const ACSP_SERVICE_PORT = "18644";
export const ACSP_SERVICE_BASE = `${ACSP_SERVICE_HOST}:${ACSP_SERVICE_PORT}/acsp-api`;
export const ACSP_SERVICE_TRANSACTION_URI = `${ACSP_SERVICE_BASE}/transactions`;
export const API_URL = getEnvironmentValue("API_URL", "http://api.chs.local:4001");
export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");
export const CHS_URL = getEnvironmentValue("CHS_URL", "http://chs.local");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET", "ChGovUk-XQrbf3sLj2abFxIY2TlapsJ");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN", "chs.local");
export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER", "localhost:6379");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME", "__SID");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const CREATE_DESCRIPTION = "Create an ACSP registration transaction";
export const REFERENCE = "ACSP Registration";
export const transactionStatuses = {
    CLOSED: "closed"
};

export const ACSP_HOME_PAGE = "/register-acsp";
export const SIGN_OUT_PAGE = `signout`;

export const HOME_URL = `${ACSP_HOME_PAGE}/home`;
export const COMPANY_BASE_URL = `${ACSP_HOME_PAGE}/company`;
export const EMAIL_BASE_URL = `${ACSP_HOME_PAGE}/email`;

export const SIGN_OUT_URL = `${HOME_URL}/${SIGN_OUT_PAGE}`;
