import { addLangToUrl, selectLang } from "../../../src/utils/localise";

describe("selectLang", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should return 'cy' for 'cy'", () => {
        expect(selectLang("cy")).toBe("cy");
    });

    it("should return 'cy' for 'cy?lang=cy'", () => {
        expect(selectLang("cy?lang=cy")).toBe("cy");
    });

    it("should return 'en' for 'en'", () => {
        expect(selectLang("en")).toBe("en");
    });

    it("should return 'en' for 'en?lang=en'", () => {
        expect(selectLang("en?lang=en")).toBe("en");
    });

    it("should return 'en' for any other value", () => {
        expect(selectLang("fr")).toBe("en");
        expect(selectLang("")).toBe("en");
        expect(selectLang(null)).toBe("en");
        expect(selectLang(undefined)).toBe("en");
    });
});

describe("addLangToUrl", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should add lang parameter to URL without query string", () => {
        expect(addLangToUrl("http://example.com", "cy")).toBe("http://example.com?lang=cy");
    });

    it("should add lang parameter to URL with existing query string", () => {
        expect(addLangToUrl("http://example.com?param=value", "cy")).toBe("http://example.com?param=value&lang=cy");
    });

    it("should return the same URL if lang is undefined", () => {
        expect(addLangToUrl("http://example.com", undefined)).toBe("http://example.com");
    });

    it("should return the same URL if lang is an empty string", () => {
        expect(addLangToUrl("http://example.com", "")).toBe("http://example.com");
    });
});
