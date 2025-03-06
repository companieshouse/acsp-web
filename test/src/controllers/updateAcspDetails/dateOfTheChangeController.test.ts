import { get, post } from "../../../../src/controllers/features/update-acsp/dateOfTheChangeController";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../../src/utils/localise";
import * as config from "../../../../src/config";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_UPDATE_CHANGE_DATE } from "../../../../src/common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../../src/validation/validation";
import * as localise from "../../../../src/utils/localise";

jest.mock("../../../../src/validation/validation", () => ({
    ...jest.requireActual("../../../../src/validation/validation"),
    getPageProperties: jest.fn(),
    formatValidationError: jest.fn()
}));

jest.mock("express-validator");
jest.mock("../../../../src/utils/localise");
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

    describe("get", () => {
        it("should render the page with the correct parameters", async () => {
            const lang = "en";
            const locales = {
                lang
            };
            const previousPage = "/update-your-details";
            const currentUrl = "/view-and-update-the-authorised-agents-details/date-of-the-change";

            (selectLang as jest.Mock).mockReturnValue(lang);
            (getLocalesService as jest.Mock).mockReturnValue(locales);
            (addLangToUrl as jest.Mock).mockReturnValue(previousPage);
            (getLocaleInfo as jest.Mock).mockReturnValue({ some: "localeInfo" });

            await get(req as Request, res as Response, next);
            expect(getLocalesService).toHaveBeenCalled();
            expect(addLangToUrl).toHaveBeenCalledWith("/view-and-update-the-authorised-agents-details/update-your-details", lang);
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
