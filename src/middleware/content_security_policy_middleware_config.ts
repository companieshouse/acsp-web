import { HelmetOptions } from "helmet";
import { CDN_HOST, PIWIK_URL, PIWIK_CHS_DOMAIN, CHS_URL } from "../utils/properties";

const SELF = `'self'`;
const ONE_YEAR_SECONDS = 31536000;
// Design System hash value from: https://frontend.design-system.service.gov.uk/import-javascript/#if-our-inline-javascript-snippet-is-blocked-by-a-content-security-policy
const DS_SCRIPT_HASH = `'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='`;

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const NONCE = `'nonce-${nonce}'`;
    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN_HOST],
                imgSrc: [CDN_HOST],
                styleSrc: [NONCE, CDN_HOST],
                connectSrc: [SELF, PIWIK_URL, CHS_URL],
                formAction: formActionDirectiveDefault(),
                scriptSrc: [NONCE, CDN_HOST, PIWIK_URL, DS_SCRIPT_HASH],
                manifestSrc: [CDN_HOST],
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

export const prepareCSPConfigHomePage = (nonce: string) : HelmetOptions => {
    const NONCE = `'nonce-${nonce}'`;
    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN_HOST],
                imgSrc: [CDN_HOST],
                styleSrc: [NONCE, CDN_HOST],
                connectSrc: [SELF, PIWIK_URL, CHS_URL],
                formAction: formActionDirectiveHomePage(),
                scriptSrc: [NONCE, CDN_HOST, PIWIK_URL, DS_SCRIPT_HASH],
                manifestSrc: [CDN_HOST],
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

const formActionDirectiveHomePage = () => {
    const ACCOUNT_URL = "https://account.cidev.aws.chdev.org/";
    const HTTP_ACCOUNT_URL = ACCOUNT_URL.replace(/^https:\/\//, "http://");
    return [
        SELF,
        PIWIK_CHS_DOMAIN,
        CHS_URL,
        ACCOUNT_URL,
        HTTP_ACCOUNT_URL
    ];
};

const formActionDirectiveDefault = () => {
    const GOV_UK = "https://*.gov.uk";
    return [SELF, PIWIK_CHS_DOMAIN, CHS_URL, GOV_UK];
};
