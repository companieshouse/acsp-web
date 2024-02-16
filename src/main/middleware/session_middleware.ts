import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../config";

const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

// passing true to SessionMiddleware means
// that a session will be created if none found

export const sessionMiddleware = SessionMiddleware({
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION)
}, sessionStore, true);
