import { HelmetOptions } from "helmet";
import { CDN_HOST, PIWIK_URL, PIWIK_CHS_DOMAIN, CHS_URL, ACCOUNT_URL } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION, SAVED_APPLICATION } from "../types/pageURL";
import { url } from "inspector";

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;
    const CHS_NO_HTTPS = removeHttpsFromURL(CHS_URL);
    const ACCOUNT_NO_HTTPS = removeHttpsFromURL(ACCOUNT_URL);

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN_HOST],
                imgSrc: [CDN_HOST],
                styleSrc: [NONCE, CDN_HOST],
                connectSrc: [SELF, PIWIK_URL, CHS_URL],
                formAction: [SELF, PIWIK_CHS_DOMAIN, CHS_NO_HTTPS, ACCOUNT_NO_HTTPS],
                scriptSrc: [NONCE, CDN_HOST, PIWIK_URL],
                objectSrc: [`'none'`]
            }
        },
        referrerPolicy: {
            policy: ["same-origin"]
        },
        hsts: {
            maxAge: ONE_YEAR_SECONDS,
            includeSubDomains: true
        }
    };
};

const removeHttpsFromURL = (url: string) => {
    return url.replace(/^https?:\/\//, "");
};
