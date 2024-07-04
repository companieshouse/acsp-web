import { getEnvironmentVariable, getEnvironmentValue } from "./environment/environment_value";

export const APPLICATION_NAME = "acsp-web";

export const ACCOUNT_URL = getEnvironmentVariable("ACCOUNT_LOCAL_URL", "false");

export const SHOW_SERVICE_OFFLINE_PAGE = getEnvironmentVariable("SHOW_SERVICE_OFFLINE_PAGE", "false");

export const INTERNAL_API_URL = getEnvironmentVariable("INTERNAL_API_URL", "false");

export const LOCALES_ENABLED = getEnvironmentVariable("LOCALES_ENABLED", "true");

export const LOCALES_PATH = getEnvironmentVariable("LOCALES_PATH", "locales");

export const POSTCODE_ADDRESSES_LOOKUP_URL = getEnvironmentVariable("POSTCODE_ADDRESSES_LOOKUP_URL", "http://postcode.cidev.aws.chdev.org");

export const API_URL = getEnvironmentValue("API_URL", "http://api.chs.local:4001");

export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");

export const CHS_URL = getEnvironmentValue("CHS_URL", "http://chs.local");

export const CDN_URL_CSS = getEnvironmentValue("CDN_URL_CSS", "http://chs.local");

export const CDN_URL_JS = getEnvironmentValue("CDN_URL_JS", "http://chs.local");

export const CDN_HOST = getEnvironmentValue("CDN_HOST", "http://chs.local");

export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET", "ChGovUk-XQrbf3sLj2abFxIY2TlapsJ");

export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN", "chs.local");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER", "localhost:6379");

export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME", "__SID");

export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");

export const PIWIK_URL = getEnvironmentValue("PIWIK_URL", "https://matomo.platform.aws.chdev.org/");

export const PIWIK_SITE_ID = getEnvironmentValue("PIWIK_SITE_ID", "1");

export const PIWIK_EMBED = getEnvironmentValue("PIWIK_EMBED", "1");

export const PIWIK_START_GOAL_ID = getEnvironmentValue("PIWIK_START_GOAL_ID", "4");

export const FEATURE_FLAG_DISABLE_LIMITED_JOURNEY = getEnvironmentValue("FEATURE_FLAG_DISABLE_LIMITED_JOURNEY", "false");

export const FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY = getEnvironmentValue("FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY", "false");
