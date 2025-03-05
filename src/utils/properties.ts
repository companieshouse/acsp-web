import { getEnvironmentVariable, getEnvironmentValue } from "./environment/environment_value";

export const APPLICATION_NAME = "acsp-web";

// Hosts and URLS

export const ACCOUNT_URL = getEnvironmentVariable("ACCOUNT_LOCAL_URL", "false");

export const INTERNAL_API_URL = getEnvironmentVariable("INTERNAL_API_URL", "false");

export const POSTCODE_ADDRESSES_LOOKUP_URL = getEnvironmentVariable("POSTCODE_ADDRESSES_LOOKUP_URL", "false");

export const API_URL = getEnvironmentValue("API_URL", "false");

export const API_LOCAL_URL = getEnvironmentValue("API_LOCAL_URL", "false");

export const PAYMENTS_API_URL = getEnvironmentValue("PAYMENTS_API_URL", "false");

export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN", "false");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER", "false");

export const CHS_URL = getEnvironmentValue("CHS_URL", "false");

export const CDN_URL_CSS = getEnvironmentValue("CDN_URL_CSS", "false");

export const CDN_URL_JS = getEnvironmentValue("CDN_URL_JS", "false");

export const CDN_HOST = getEnvironmentValue("CDN_HOST", "false");

export const ANY_PROTOCOL_CDN_HOST = getEnvironmentValue("ANY_PROTOCOL_CDN_HOST", "false");

export const CHS_MONITOR_GUI_URL = getEnvironmentValue("CHS_MONITOR_GUI_URL");

// API Keys and Secrets

export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");

export const CHS_INTERNAL_API_KEY = getEnvironmentValue("CHS_INTERNAL_API_KEY");

export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET", "ChGovUk-XQrbf3sLj2abFxIY2TlapsJ");

export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME", "__SID");

// Misc Config

export const LOCALES_ENABLED = getEnvironmentVariable("LOCALES_ENABLED", "true");

export const LOCALES_PATH = getEnvironmentVariable("LOCALES_PATH", "locales");

export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");

export const COOKIE_SECURE_ONLY = getEnvironmentValue("COOKIE_SECURE_ONLY");

export const PIWIK_CHS_DOMAIN = getEnvironmentValue("PIWIK_CHS_DOMAIN", "*.chs.local");

export const ACSP01_COST = getEnvironmentValue("ACSP01_COST", "50.00");

// Matomo

export const PIWIK_URL = getEnvironmentValue("PIWIK_URL", "https://matomo.identity.aws.chdev.org/");

export const PIWIK_SITE_ID = getEnvironmentValue("PIWIK_SITE_ID", "1");

export const PIWIK_EMBED = getEnvironmentValue("PIWIK_EMBED", "1");

export const PIWIK_REGISTRATION_START_GOAL_ID = getEnvironmentValue("PIWIK_REGISTRATION_START_GOAL_ID", "17");

export const PIWIK_REGISTRATION_LC_ID = getEnvironmentValue("PIWIK_LC_ID", "1");

export const PIWIK_REGISTRATION_LP_ID = getEnvironmentValue("PIWIK_LP_ID", "2");

export const PIWIK_REGISTRATION_LLP_ID = getEnvironmentValue("PIWIK_LLP_ID", "3");

export const PIWIK_REGISTRATION_PARTNERSHIP_ID = getEnvironmentValue("PIWIK_PARTNERSHIP_ID", "4");

export const PIWIK_REGISTRATION_SOLE_TRADER_ID = getEnvironmentValue("PIWIK_SOLE_TRADER_ID", "5");

export const PIWIK_REGISTRATION_UNINCORPORATED_ID = getEnvironmentValue("PIWIK_UNINCORPORATED_ID", "6");

export const PIWIK_REGISTRATION_CORPORATE_BODY_ID = getEnvironmentValue("PIWIK_CORPORATE_BODY_ID", "7");

export const PIWIK_REGISTRATION_CHECK_YOUR_ANSWERS_ID = getEnvironmentValue("PIWIK_REGISTRATION_CHECK_YOUR_ANSWERS_ID", "11");

// Feature Flags

export const FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY = getEnvironmentValue("FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY", "false");

export const FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = getEnvironmentValue("FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS", "true");

export const FEATURE_FLAG_ENABLE_CLOSE_ACSP = getEnvironmentValue("FEATURE_FLAG_CLOSE_ACSP", "true");
