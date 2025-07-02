/* eslint-disable import/first */
import mocks from "../../../mocks/all_middleware_mock";
import { mockLimitedAcspFullProfile } from "../../../mocks/update_your_details.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_WHAT_IS_THE_COMPANY_NAME } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";

jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + UPDATE_WHAT_IS_THE_BUSINESS_NAME, () => {

    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the name of the business?");
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_WHAT_IS_THE_BUSINESS_NAME, () => {

    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME)
            .send({
                whatIsTheBusinessName: "abc ltd"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(400);
    });

    it("should return status 400 and display error message when no business name entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME)
            .send({
                whatIsTheBusinessName: ""
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter the business name");
    });

    it("should return status 400 and display error message when no change has been made to business name", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME)
            .send({
                whatIsTheBusinessName: "Test name"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update the business name if it&#39;s changed or cancel the update");
    });

    it("should return status 400 and display error message when invalid characters entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME)
            .send({
                whatIsTheBusinessName: "%$^£"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Business name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("GET" + UPDATE_WHAT_IS_THE_COMPANY_NAME, () => {

    it("should return status 200 and render page as a limited company", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile),
                deleteExtraData: jest.fn()
            };
            next();
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What is the company name?");
    });
});

describe("POST" + UPDATE_WHAT_IS_THE_COMPANY_NAME, () => {

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME);
        expect(res.status).toBe(400);
    });

    it("should return status 400 and display error message when no company name entered as a ltd company", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME)
            .send({
                whatIsTheBusinessName: ""
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter the company name or cancel the update");
    });

    it("should return status 400 and display error message when no change has been made to ltd company name", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME)
            .send({
                whatIsTheBusinessName: "Example ACSP Ltd"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update the company name if it&#39;s changed or cancel the update");
    });

    it("should return status 400 and display error message when invalid characters entered as a ltd company", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME)
            .send({
                whatIsTheBusinessName: "Example ACSP Ltd%^$&"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Company name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes");
    });

    it("should return status 400 and display error message when over 155 characters as a ltd company", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME)
            .send({
                whatIsTheBusinessName: "a".repeat(156)
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Company name must be 155 characters or less");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
