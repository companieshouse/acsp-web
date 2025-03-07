import { get, post, determinePreviousPageUrl } from "../../../../src/controllers/features/update-acsp/dateOfTheChangeController";

import { UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_WHERE_DO_YOU_LIVE, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../../src/utils/localise";
import * as config from "../../../../src/config";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_UPDATE_CHANGE_DATE } from "../../../../src/common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../../src/validation/validation";
import * as localise from "../../../../src/utils/localise";
import { getPreviousPageUrl } from "../../../../src/services/url";

jest.mock("../../../../src/validation/validation", () => ({
    ...jest.requireActual("../../../../src/validation/validation"),
    getPageProperties: jest.fn(),
    formatValidationError: jest.fn()
}));

jest.mock("express-validator");
jest.mock("../../../../src/utils/localise");
jest.mock("../../../../src/services/url", () => ({
    ...jest.requireActual("../../../../src/services/url"),
    getPreviousPageUrl: jest.fn()
}));
jest.mock("../../../../src/config");

describe("dateOfTheChangeController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
        };

        req = {
            session: session as Session,
            body: {},
            query: {}
        } as Partial<Request>;

        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            redirect: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });
    describe("dateOfTheChangeController", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: jest.Mock;

        beforeEach(() => {
            req = {
                query: {}
            } as Partial<Request>;

            res = {
                render: jest.fn()
            } as Partial<Response>;

            next = jest.fn();
        });

        it("should render the page with the correct parameters", async () => {
            const lang = "en";
            const locales = { some: "locales" };
            const prevUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME;
            const previousPage = "/update-your-answers";
            const currentUrl = "/view-and-update-the-authorised-agents-details/date-of-the-change";

            (selectLang as jest.Mock).mockReturnValue(lang);
            (getLocalesService as jest.Mock).mockReturnValue(locales);
            (getPreviousPageUrl as jest.Mock).mockReturnValue(prevUrl);
            (addLangToUrl as jest.Mock).mockReturnValue(previousPage);
            (getLocaleInfo as jest.Mock).mockReturnValue({ some: "localeInfo" });

            await get(req as Request, res as Response, next);

            expect(selectLang).toHaveBeenCalledWith(req.query?.lang);
            expect(getLocalesService).toHaveBeenCalled();
            expect(getPreviousPageUrl).toHaveBeenCalledWith(req, UPDATE_ACSP_DETAILS_BASE_URL);
            expect(addLangToUrl).toHaveBeenCalledWith(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME, lang);
            expect(res.render).toHaveBeenCalledWith(config.UPDATE_DATE_OF_THE_CHANGE, {
                some: "localeInfo",
                previousPage,
                currentUrl
            });
        });

        it("should call next with an error if rendering fails", async () => {
            const error = new Error("Test error");
            (res.render as jest.Mock).mockImplementation(() => {
                throw error;
            });

            await get(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe("post", () => {
        it("should render the page with errors if validation fails", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue([{ msg: "Error" }])
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const locales = { some: "locales" };
            const currentUrl = "/view-and-update-the-authorised-agents-details/date-of-the-change";
            const previousPage = "/update-your-details";

            (selectLang as jest.Mock).mockReturnValue(lang);
            (getLocalesService as jest.Mock).mockReturnValue(locales);
            (addLangToUrl as jest.Mock).mockReturnValue(previousPage);
            (getLocaleInfo as jest.Mock).mockReturnValue({ some: "localeInfo" });
            (getPageProperties as jest.Mock).mockReturnValue({ some: "pageProperties" });
            (formatValidationError as jest.Mock).mockReturnValue([{ msg: "Formatted Error" }]);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.render).toHaveBeenCalledWith(config.UPDATE_DATE_OF_THE_CHANGE, {
                previousPage,
                currentUrl,
                pageProperties: { some: "pageProperties" },
                payload: req.body,
                some: "localeInfo"
            });
        });

        it("should set the date of change and redirect if validation passes", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should set the date of change for NAME if NAMEOFBUSINESS is already set", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should set the date of change for WHEREDOYOULIVE if NAMEOFBUSINESS is already set", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should set the date of change for REGOFFICEADDRESS if NAMEOFBUSINESS is already set", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should set the date of change for CORRESPONDENCEADDRESS if NAMEOFBUSINESS is already set", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should set the date of change for EMAIL if NAMEOFBUSINESS is already set", async () => {
            const errorList = {
                isEmpty: jest.fn().mockReturnValue(true)
            };
            (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
            const lang = "en";
            const dateOfChange = new Date(2023, 0, 1);
            req.body = {
                "change-year": "2023",
                "change-month": "1",
                "change-day": "1"
            };
            req.query = { lang: "en" };

            (selectLang as jest.Mock).mockReturnValue(lang);
            (addLangToUrl as jest.Mock).mockReturnValue("/update-your-details");

            (session.getExtraData as jest.Mock).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(dateOfChange).mockReturnValueOnce(null);

            await post(req as Request, res as Response, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(session.setExtraData).toHaveBeenCalledWith(ACSP_UPDATE_CHANGE_DATE.EMAIL, dateOfChange);
            expect(res.redirect).toHaveBeenCalledWith("/update-your-details");
        });
        it("should call next with an error if rendering fails", async () => {
            const error = new Error("Test error");
            jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
                throw error;
            });
            (res.render as jest.Mock).mockImplementation(() => {
                throw error;
            });

            await post(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
describe("determinePreviousPageUrl", () => {
    it("should return UPDATE_ACSP_WHAT_IS_YOUR_NAME if url includes UPDATE_ACSP_WHAT_IS_YOUR_NAME", () => {
        const url = "some/path/" + UPDATE_ACSP_WHAT_IS_YOUR_NAME;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_ACSP_WHAT_IS_YOUR_NAME);
    });

    it("should return UPDATE_WHERE_DO_YOU_LIVE if url includes UPDATE_WHERE_DO_YOU_LIVE", () => {
        const url = "some/path/" + UPDATE_WHERE_DO_YOU_LIVE;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHERE_DO_YOU_LIVE);
    });

    it("should return UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP if url includes UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM", () => {
        const url = "some/path/" + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP);
    });

    it("should return UPDATE_WHAT_IS_YOUR_EMAIL if url includes UPDATE_WHAT_IS_YOUR_EMAIL", () => {
        const url = "some/path/" + UPDATE_WHAT_IS_YOUR_EMAIL;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHAT_IS_YOUR_EMAIL);
    });

    it("should return UPDATE_WHAT_IS_THE_BUSINESS_NAME if url includes UPDATE_WHAT_IS_THE_BUSINESS_NAME", () => {
        const url = "some/path/" + UPDATE_WHAT_IS_THE_BUSINESS_NAME;
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_WHAT_IS_THE_BUSINESS_NAME);
    });

    it("should return UPDATE_YOUR_ANSWERS if url does not include any specific path", () => {
        const url = "some/path/unknown";
        const result = determinePreviousPageUrl(url);
        expect(result).toBe(UPDATE_YOUR_ANSWERS);
    });
});
