import jwt, { SignOptions } from "jsonwebtoken";

/*
 * Generic signed-redirect helpers for passing a user between CHS services.
 * This module deliberately has no acsp-web dependencies (env, constants, localisation)
 * so it can be moved into a shared library without changes.
 */

/**
 * A number of seconds, or a timespan string such as "5m" or "300s".
 */
export type TokenExpiry = NonNullable<SignOptions["expiresIn"]>;

export const DEFAULT_TOKEN_EXPIRY: TokenExpiry = "10m";

export const REDIRECT_TOKEN_PARAM = "token";

export interface RedirectClaims {
    return_url?: string;
    back_url?: string;
    lang?: string;
}

export interface RedirectOptions {
    chsUrl: string;
    secret: string;
    expiresIn?: TokenExpiry;
}

export const createRedirectToken = <T extends RedirectClaims>(
    claims: T,
    secret: string,
    expiresIn: TokenExpiry = DEFAULT_TOKEN_EXPIRY
): string => {
    if (!secret) {
        throw new Error("A secret is required to sign the redirect token");
    }
    return jwt.sign({ ...claims }, secret, { algorithm: "HS256", expiresIn });
};

/**
 * Builds an absolute URL to the given CHS path with the signed claims as the token query parameter.
 */
export const getRedirectUrl = <T extends RedirectClaims>(path: string, claims: T, options: RedirectOptions): string => {
    const token = createRedirectToken(claims, options.secret, options.expiresIn);
    return `${options.chsUrl}${path}?${REDIRECT_TOKEN_PARAM}=${encodeURIComponent(token)}`;
};

/**
 * Converts a configured expiry into the type jwt.sign expects. Purely numeric values are
 * treated as seconds; anything else is passed through as a timespan string, which jwt.sign
 * validates when signing. An empty value returns undefined so createRedirectToken applies
 * DEFAULT_TOKEN_EXPIRY.
 */
export const parseTokenExpiry = (value: string | undefined): TokenExpiry | undefined => {
    const trimmed = value?.trim();
    if (!trimmed) {
        return undefined;
    }
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed as TokenExpiry;
};
