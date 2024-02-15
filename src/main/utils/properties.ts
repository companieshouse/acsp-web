/**
 * Gets an environment variable. If the env var is not set and a default value is not
 * provided, then it is assumed it is a mandatory requirement and an error will be
 * thrown.
 */
const getEnvironmentVariable = (key: string, defaultValue?: any): string => {
    const isMandatory = !defaultValue;
    const value: string = process.env[key] || "";

    if (!value && isMandatory) {
        throw new Error(`Please set the environment variable "${key}"`);
    }
    return value || defaultValue as string;
};

export const ACCOUNT_URL = getEnvironmentVariable("ACCOUNT_URL", "false");

export const COOKIE_NAME = getEnvironmentVariable("COOKIE_NAME", "false");

export const COOKIE_DOMAIN = getEnvironmentVariable("COOKIE_DOMAIN", "false");

export const COOKIE_SECRET = getEnvironmentVariable("COOKIE_SECRET", "false");

export const CACHE_SERVER = getEnvironmentVariable("CACHE_SERVER", "false");

export const SHOW_SERVICE_OFFLINE_PAGE = getEnvironmentVariable("SHOW_SERVICE_OFFLINE_PAGE", "false");

export const CHS_API_KEY = getEnvironmentVariable("CHS_API_KEY", "false");

export const CHS_URL = getEnvironmentVariable("CHS_URL", "false");

export const API_URL = getEnvironmentVariable("API_URL", "false");

export const INTERNAL_API_URL = getEnvironmentVariable("INTERNAL_API_URL", "false");

export const LOCALES_ENABLED = getEnvironmentVariable("LOCALES_ENABLED", "true");

export const LOCALES_PATH = getEnvironmentVariable("LOCALES_PATH", "src/locales");

export const POSTCODE_ADDRESSES_LOOKUP_URL = getEnvironmentVariable("POSTCODE_ADDRESSES_LOOKUP_URL", "http://postcode.cidev.aws.chdev.org");
