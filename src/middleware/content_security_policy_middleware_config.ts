import { HelmetOptions } from "helmet";
import { CDN_HOST, PIWIK_URL, PIWIK_CHS_DOMAIN, CHS_URL, ACCOUNT_URL } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION, SAVED_APPLICATION } from "../types/pageURL";

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;

    const CHS_SIGN_IN = `${CHS_URL}/signin`;
    const OAUTH_AUTHORIZE = `${ACCOUNT_URL}/oauth2/authorize`;
    const OAUTH_CHOOSE_SIGN_IN = `${ACCOUNT_URL}/oauth2/user/choose-your-signin`;
    const OAUTH_USER_CALL_BACK = `${CHS_URL}/user/callback`;
    const HAS_IDENTITY_BEEN_VERIFIED = `${ACCOUNT_URL}/identity-verification/redirect/has-identity-been-verified`;
    const VERIFY_IDENTITY = `${ACCOUNT_URL}/identity-verification/verify-your-identity-for-companies-house`;

    const ALL_CHS_URLS = `${CHS_URL}/*`;
    const ALL_CHS_ACCOUNT_URLS = `${ACCOUNT_URL}/*`;

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN_HOST],
                imgSrc: [CDN_HOST],
                styleSrc: [NONCE, CDN_HOST],
                connectSrc: [SELF, PIWIK_URL, CHS_URL],
                formAction: [SELF, PIWIK_CHS_DOMAIN, ALL_CHS_URLS, ALL_CHS_ACCOUNT_URLS],
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
