import jwt, { JwtPayload } from "jsonwebtoken";
import { getPresenterRedirectUrl } from "../../../src/services/presenterRedirectService";

// Matches CHS_JWT_SECRET and CHS_URL in test/src/setup.ts
const SECRET = "test-chs-jwt-secret";
const CHS_URL = "http://chs.local";
const PRESENTER_URL_PREFIX = CHS_URL + "/transaction/11111/presenter?token=";

const getTokenFromUrl = (url: string): string => new URL(url).searchParams.get("token")!;

describe("presenterRedirectService", () => {
    describe("getPresenterRedirectUrl", () => {
        it("should build the ACSP01 claims with absolute return and back urls in english", () => {
            const url = getPresenterRedirectUrl("11111", "/next-page", "/current-page", "en");
            expect(url.startsWith(PRESENTER_URL_PREFIX)).toBe(true);
            const decoded = jwt.verify(getTokenFromUrl(url), SECRET) as JwtPayload;
            expect(decoded).toEqual(expect.objectContaining({
                form_type: "ACSP01",
                transaction_id: "11111",
                return_url: CHS_URL + "/next-page?lang=en",
                back_url: CHS_URL + "/current-page?lang=en",
                lang: "en"
            }));
        });

        it("should build the claims with welsh urls and lang when lang is cy", () => {
            const url = getPresenterRedirectUrl("11111", "/next-page", "/current-page", "cy");
            const decoded = jwt.verify(getTokenFromUrl(url), SECRET) as JwtPayload;
            expect(decoded.return_url).toBe(CHS_URL + "/next-page?lang=cy");
            expect(decoded.back_url).toBe(CHS_URL + "/current-page?lang=cy");
            expect(decoded.lang).toBe("cy");
        });

        it("should default to a 10 minute expiry when JWT_TOKEN_EXPIRY is not set", () => {
            const url = getPresenterRedirectUrl("11111", "/next-page", "/current-page", "en");
            const decoded = jwt.verify(getTokenFromUrl(url), SECRET) as JwtPayload;
            expect(decoded.exp! - decoded.iat!).toBe(10 * 60);
        });
    });
});
