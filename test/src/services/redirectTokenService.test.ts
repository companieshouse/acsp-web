import jwt, { JwtPayload } from "jsonwebtoken";
import {
    createRedirectToken,
    getRedirectUrl,
    parseTokenExpiry,
    RedirectClaims,
    RedirectOptions,
    TokenExpiry
} from "../../../src/services/redirectTokenService";

const SECRET = "test-secret";
const CHS_URL = "http://chs.local";
const options: RedirectOptions = { chsUrl: CHS_URL, secret: SECRET };

const claims: RedirectClaims = {
    return_url: CHS_URL + "/next-page?lang=en",
    back_url: CHS_URL + "/current-page?lang=en",
    lang: "en"
};

const getTokenFromUrl = (url: string): string => new URL(url).searchParams.get("token")!;

describe("redirectTokenService", () => {
    describe("createRedirectToken", () => {
        it("should sign a token containing the supplied claims", () => {
            const token = createRedirectToken(claims, SECRET);
            expect(jwt.verify(token, SECRET)).toEqual(expect.objectContaining(claims));
        });

        it("should sign service-specific claims that extend the redirect claims", () => {
            const extendedClaims = { ...claims, some_other_claim: "value" };
            const token = createRedirectToken(extendedClaims, SECRET);
            expect(jwt.verify(token, SECRET)).toEqual(expect.objectContaining(extendedClaims));
        });

        it("should sign the token using HS256", () => {
            const token = createRedirectToken(claims, SECRET);
            expect(jwt.decode(token, { complete: true })!.header.alg).toBe("HS256");
        });

        it("should default to a 10 minute expiry", () => {
            const decoded = jwt.verify(createRedirectToken(claims, SECRET), SECRET) as JwtPayload;
            expect(decoded.exp! - decoded.iat!).toBe(10 * 60);
        });

        it.each([
            ["10m", 10 * 60],
            [120, 120]
        ])("should use the supplied expiry %p", (expiresIn, expectedSeconds) => {
            const token = createRedirectToken(claims, SECRET, expiresIn as TokenExpiry);
            const decoded = jwt.verify(token, SECRET) as JwtPayload;
            expect(decoded.exp! - decoded.iat!).toBe(expectedSeconds);
        });

        it("should throw an error if the expiry is not a valid timespan", () => {
            expect(() => createRedirectToken(claims, SECRET, "not-a-timespan" as TokenExpiry)).toThrow();
        });

        it("should throw an error if the claims already contain an exp claim", () => {
            const claimsWithExp = { ...claims, exp: 123 };
            expect(() => createRedirectToken(claimsWithExp, SECRET)).toThrow();
        });

        it("should not verify with a different secret", () => {
            const token = createRedirectToken(claims, SECRET);
            expect(() => jwt.verify(token, "another-secret")).toThrow();
        });

        it("should throw an error if the secret is missing", () => {
            expect(() => createRedirectToken(claims, "")).toThrow("A secret is required");
        });
    });

    describe("getRedirectUrl", () => {
        it("should build an absolute url to the given path with the token as a query parameter", () => {
            const url = getRedirectUrl("/some/path", claims, options);
            expect(url.startsWith(CHS_URL + "/some/path?token=")).toBe(true);
            expect(jwt.verify(getTokenFromUrl(url), SECRET)).toEqual(expect.objectContaining(claims));
        });

        it("should default to a 10 minute expiry when no expiry is supplied", () => {
            const url = getRedirectUrl("/some/path", claims, { ...options, expiresIn: undefined });
            const decoded = jwt.verify(getTokenFromUrl(url), SECRET) as JwtPayload;
            expect(decoded.exp! - decoded.iat!).toBe(10 * 60);
        });

        it("should use the supplied expiry", () => {
            const url = getRedirectUrl("/some/path", claims, { ...options, expiresIn: 60 });
            const decoded = jwt.verify(getTokenFromUrl(url), SECRET) as JwtPayload;
            expect(decoded.exp! - decoded.iat!).toBe(60);
        });
    });

    describe("parseTokenExpiry", () => {
        it.each([
            [undefined, undefined],
            ["", undefined],
            ["   ", undefined],
            ["300", 300],
            ["10m", "10m"],
            [" 1h ", "1h"]
        ])("should parse %p as %p", (value, expected) => {
            expect(parseTokenExpiry(value)).toBe(expected);
        });
    });
});
