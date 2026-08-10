import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { selectLang } from "../utils/localise";

/**
 * Persists the user's selected language using the shared core session key
 * (Session#getLanguage / Session#setLanguage, i.e. SessionKey.Lang in
 * node-session-handler) rather than a service-specific extra_data key, so
 * the preference is shared correctly with other CHS services (e.g.
 * authentication-service, your-companies-web) that read/write the same
 * top-level session key.
 *
 * When a "lang" query parameter is present on the request it takes
 * precedence and is persisted to the session; otherwise the previously
 * persisted session value (if any) is used, falling back to the default
 * ("en") via selectLang. req.query.lang is normalised to the resolved value
 * so downstream code (which reads the language via selectLang(req.query.lang))
 * continues to work unchanged.
 *
 * getLanguage/setLanguage are guarded with typeof checks (rather than just
 * optional chaining) so this middleware tolerates req.session objects that
 * don't implement the full Session class API - e.g. minimal plain-object
 * session mocks used in some existing controller tests.
 */
export const languageMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const session: Session | undefined = req.session as any as Session;
    const queryLang = req.query.lang as string | undefined;

    const sessionLang = typeof session?.getLanguage === "function" ? session.getLanguage() : undefined;

    const lang = queryLang !== undefined && queryLang !== ""
        ? selectLang(queryLang)
        : selectLang(sessionLang);

    if (typeof session?.setLanguage === "function") {
        session.setLanguage(lang);
    }
    req.query.lang = lang;

    next();
};
