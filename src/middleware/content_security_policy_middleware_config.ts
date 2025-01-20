import { HelmetOptions } from "helmet";
import { CDN_HOST, PIWIK_URL, PIWIK_CHS_DOMAIN, CHS_URL } from "../utils/properties";

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;
    const CHS_URL_NO_PROTOCOL = removeProtocol(CHS_URL);

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN_HOST],
                imgSrc: [CDN_HOST],
                styleSrc: [NONCE, CDN_HOST],
                connectSrc: [SELF, PIWIK_URL],
                formAction: [SELF, PIWIK_CHS_DOMAIN, CHS_URL_NO_PROTOCOL, PIWIK_URL, NONCE],
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

const removeProtocol = (url: string): string => {
    return url.replace(/https?:\/\//, "");
};
