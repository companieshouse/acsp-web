import { NextFunction, Request, Response } from "express";
import { languageMiddleware } from "../../../src/middleware/language_middleware";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";

describe("language middleware tests", () => {
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should persist the query lang param to the core session lang key and normalise req.query.lang", () => {
        const session = getSessionRequestWithPermission();
        const req = {
            session,
            query: { lang: "cy" }
        } as unknown as Request;

        languageMiddleware(req, mockResponse, mockNext);

        expect(session.getLanguage()).toEqual("cy");
        expect(req.query.lang).toEqual("cy");
        expect(mockNext).toHaveBeenCalled();
    });

    it("should fall back to the previously persisted core session lang value when no query param is present", () => {
        const session = getSessionRequestWithPermission();
        session.setLanguage("cy");
        const req = {
            session,
            query: {}
        } as unknown as Request;

        languageMiddleware(req, mockResponse, mockNext);

        expect(session.getLanguage()).toEqual("cy");
        expect(req.query.lang).toEqual("cy");
        expect(mockNext).toHaveBeenCalled();
    });

    it("should default to English and persist it when neither the query param nor the session have a value", () => {
        const session = getSessionRequestWithPermission();
        const req = {
            session,
            query: {}
        } as unknown as Request;

        languageMiddleware(req, mockResponse, mockNext);

        expect(session.getLanguage()).toEqual("en");
        expect(req.query.lang).toEqual("en");
        expect(mockNext).toHaveBeenCalled();
    });

    it("should prefer the query param over an existing session value", () => {
        const session = getSessionRequestWithPermission();
        session.setLanguage("cy");
        const req = {
            session,
            query: { lang: "en" }
        } as unknown as Request;

        languageMiddleware(req, mockResponse, mockNext);

        expect(session.getLanguage()).toEqual("en");
        expect(req.query.lang).toEqual("en");
        expect(mockNext).toHaveBeenCalled();
    });

    it("should not throw when there is no session on the request", () => {
        const req = {
            session: undefined,
            query: { lang: "cy" }
        } as unknown as Request;

        expect(() => languageMiddleware(req, mockResponse, mockNext)).not.toThrow();
        expect(req.query.lang).toEqual("cy");
        expect(mockNext).toHaveBeenCalled();
    });

    it("should not throw when req.session is a plain object without getLanguage/setLanguage", () => {
        const req = {
            session: { getExtraData: () => undefined },
            query: { lang: "cy" }
        } as unknown as Request;

        expect(() => languageMiddleware(req, mockResponse, mockNext)).not.toThrow();
        expect(req.query.lang).toEqual("cy");
        expect(mockNext).toHaveBeenCalled();
    });
});
