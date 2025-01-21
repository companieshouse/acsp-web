import { CsrfError } from "@companieshouse/web-security-node";
import logger from "../../../src/utils/logger";
import createHttpError from "http-errors";
import { csrfErrorHandler, httpErrorHandler, unhandledErrorHandler } from "../../../src/controllers/errorController";
import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import { NextFunction } from "express";
import { addLangToUrl } from "../../../src/utils/localise";
import { CHS_URL } from "../../../src/utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../../../src/types/pageURL";

logger.error = jest.fn();
const request = mockRequest();
const response = mockResponse();
const mockNext: NextFunction = jest.fn();

describe("httpErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should detect a 401 httpError and redirect to checked save application page", async () => {
        const url = addLangToUrl("/originalUrl", "en");
        // Given
        request.originalUrl = url;
        request.method = "GET";
        request.query = {
            lang: "en"
        };

        const err = createHttpError(401);
        err.httpStatusCode = 401;
        // When
        httpErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.redirect).toHaveBeenCalledWith(`${CHS_URL}/signin?return_to=${BASE_URL}${CHECK_SAVED_APPLICATION}`);
    });

    it("should ignore errors that are not 401 and pass them to next", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        const error = createHttpError(500);
        // When
        httpErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.redirect).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});

describe("csrfErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should detect a csrfError and render an error template", async () => {
        const url = addLangToUrl("/originalUrl", "en");
        // Given
        request.originalUrl = url;
        request.method = "GET";
        request.query = {
            lang: "en"
        };
        const err = new CsrfError();
        // When
        csrfErrorHandler(err, request, response, mockNext);
        // Then
        expect(response.render).toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(403);
    });
    it("should ignore errors that are not of type CsrfError and pass then to next", async () => {
        // Given
        request.originalUrl = "/originalUrl";
        request.method = "GET";
        const error = new Error();
        // When
        csrfErrorHandler(error, request, response, mockNext);
        // Then
        expect(response.render).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});

describe("unhandledErrorHandler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should log the error and render the error page", async () => {
        const url = addLangToUrl("/originalUrl", "en");
        // Given
        request.originalUrl = url;
        request.method = "GET";
        request.query = {
            lang: "en"
        };
        const error = new Error("Test error");
        // When
        unhandledErrorHandler(error, request, response, mockNext);
        // Then
        expect(logger.error).toHaveBeenCalledWith(`${error.name} - appError: ${error.message} - ${error.stack}`);
        expect(response.render).toHaveBeenCalled();
    });
});
