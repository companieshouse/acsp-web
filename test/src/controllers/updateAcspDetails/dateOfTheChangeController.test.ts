import { get, post } from "../../../../src/controllers/features/update-acsp/dateOfTheChangeController";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../../src/utils/localise";
import { getPageProperties, formatValidationError } from "../../../../src/validation/validation";
import { getPreviousPageUrl } from "../../../../src/services/url";
import { determinePreviousPageUrl, updateWithTheEffectiveDateAmendment } from "../../../../src/services/update-acsp/dateOfTheChangeService";

import * as config from "../../../../src/config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";

jest.mock("express-validator");
jest.mock("../../../../src/utils/localise");
jest.mock("../../../../src/validation/validation");
jest.mock("../../../../src/services/url");
jest.mock("../../../../src/services/update-acsp/dateOfTheChangeService");
jest.mock("../../../../src/config", () => ({
    UPDATE_DATE_OF_THE_CHANGE: "mock-update-date-of-the-change"
}));

describe("dateOfTheChangeController - GET", () => {
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
        const locales = getLocalesService(); ;
        const prevUrl = "mock/previous/url";
        const previousPage = "mock-previous-page";
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

        (selectLang as jest.Mock).mockReturnValue(lang);
        (getLocalesService as jest.Mock).mockReturnValue(locales);
        (getPreviousPageUrl as jest.Mock).mockReturnValue(prevUrl);
        (determinePreviousPageUrl as jest.Mock).mockReturnValue("mock-previous-page-url");
        (addLangToUrl as jest.Mock).mockReturnValue(previousPage);
        (getLocaleInfo as jest.Mock).mockReturnValue({ some: "localeInfo" });

        await get(req as Request, res as Response, next);
        expect(getLocalesService).toHaveBeenCalled();
        expect(getPreviousPageUrl).toHaveBeenCalledWith(req, UPDATE_ACSP_DETAILS_BASE_URL);
        expect(determinePreviousPageUrl).toHaveBeenCalledWith(prevUrl);
        expect(addLangToUrl).toHaveBeenCalledWith(UPDATE_ACSP_DETAILS_BASE_URL + "mock-previous-page-url", lang);
        expect(res.render).toHaveBeenCalledWith(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
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

describe("dateOfTheChangeController - POST", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        } as Partial<Request>;

        res = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
            redirect: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });

    it("should render the page with errors if validation fails", async () => {
        const lang = "en";
        const locales = getLocalesService();
        const errorList = {
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: "Error" }])
        };
        const pageProperties = { some: "pageProperties" };

        (validationResult as unknown as jest.Mock).mockReturnValue(errorList);
        (selectLang as jest.Mock).mockReturnValue(lang);
        (getLocalesService as jest.Mock).mockReturnValue(locales);
        (formatValidationError as jest.Mock).mockReturnValue([{ msg: "Formatted Error" }]);
        (getPageProperties as jest.Mock).mockReturnValue(pageProperties);

        req.body = {
            "change-day": "01",
            "change-month": "01",
            "change-year": "2025"
        };

        await post(req as Request, res as Response, next);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith(config.UPDATE_DATE_OF_THE_CHANGE, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE,
            pageProperties,
            payload: req.body
        });
    });

    it("should call updateWithTheEffectiveDateAmendment and redirect if validation passes", async () => {
        const lang = "en";
        const dateOfChange = new Date(2025, 0, 1); // January 1, 2025

        ((validationResult as unknown) as jest.Mock).mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
        (selectLang as jest.Mock).mockReturnValue(lang);
        (addLangToUrl as jest.Mock).mockReturnValue("mock-next-page-url");

        req.body = {
            "change-day": "01",
            "change-month": "01",
            "change-year": "2025"
        };

        await post(req as Request, res as Response, next);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(updateWithTheEffectiveDateAmendment).toHaveBeenCalledWith(req, dateOfChange);
        expect(res.redirect).toHaveBeenCalledWith("mock-next-page-url");
    });

    it("should call next with an error if an exception occurs", async () => {
        const error = new Error("Test error");
        (validationResult as unknown as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await post(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
