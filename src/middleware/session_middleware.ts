import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import { CACHE_SERVER, COOKIE_DOMAIN, COOKIE_NAME, COOKIE_SECRET, COOKIE_SECURE_ONLY, DEFAULT_SESSION_EXPIRATION } from "../utils/properties";

const redis = new Redis(CACHE_SERVER);
export const sessionStore = new SessionStore(redis);

export const sessionMiddleware = SessionMiddleware({
    cookieDomain: COOKIE_DOMAIN,
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET,
    cookieSecureFlag: COOKIE_SECURE_ONLY !== "false",
    cookieTimeToLiveInSeconds: parseInt(DEFAULT_SESSION_EXPIRATION, 10)
}, sessionStore, true);
