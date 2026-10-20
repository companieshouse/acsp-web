import { ACSP_FORM_TYPE } from "../common/__utils/constants";
import { CHS_JWT_SECRET, CHS_URL, JWT_TOKEN_EXPIRY } from "../utils/properties";
import { addLangToUrl } from "../utils/localise";
import { getRedirectUrl, parseTokenExpiry, RedirectClaims, RedirectOptions } from "./redirectTokenService";

// Hard-coded until the transactions web presenter endpoint contract is finalised
export const getPresenterRedirectPath = (transactionId: string): string =>
    `/transaction/${encodeURIComponent(transactionId)}/presenter`;

export interface PresenterInputRedirectClaims extends RedirectClaims {
    form_type: string;
    transaction_id: string;
    return_url: string;
    back_url: string;
}

export const getPresenterRedirectUrl = (transactionId: string, returnPath: string, backPath: string, lang: string): string => {
    // Typed explicitly because getRedirectUrl accepts any RedirectClaims; this enforces the presenter shape
    const claims: PresenterInputRedirectClaims = {
        form_type: ACSP_FORM_TYPE,
        transaction_id: transactionId,
        return_url: CHS_URL + addLangToUrl(returnPath, lang),
        back_url: CHS_URL + addLangToUrl(backPath, lang),
        lang
    };

    const options: RedirectOptions = {
        chsUrl: CHS_URL,
        secret: CHS_JWT_SECRET,
        expiresIn: parseTokenExpiry(JWT_TOKEN_EXPIRY)

    };

    return getRedirectUrl(getPresenterRedirectPath(transactionId), claims, options);
};
