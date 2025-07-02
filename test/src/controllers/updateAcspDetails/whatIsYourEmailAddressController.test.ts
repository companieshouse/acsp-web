import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_CHECK_YOUR_UPDATES } from "../../../../src/types/pageURL";
import { mockLimitedAcspFullProfile } from "../../../mocks/update_your_details.mock";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + UPDATE_WHAT_IS_YOUR_EMAIL, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should render the what email address should we use for correspondence page with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What email address should we use for correspondence?");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UPDATE_WHAT_IS_YOUR_EMAIL, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should redirect to UPDATE_CHECK_YOUR_UPDATES with status 302 for valid email input", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "A Different Email",
                whatIsYourEmailInput: "test@email.com"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES + "?lang=en");
    });
    it("should redirect to UPDATE_YOUR_ANSWERS with status 302 for when user does not change email", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "original@email.com",
                whatIsYourEmailInput: ""
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES + "?lang=en");
    });
    it("should return status 400 after no radio selected", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "",
                whatIsYourEmailInput: ""
            });
        expect(res.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select to enter a different email address if it’s changed or cancel the update");
    });
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "A Different Email",
                whatIsYourEmailInput: "test"
            });
        expect(res.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Enter an email address in the correct format, like name@example.com");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 400 and display error message when no change has been made to ltd company name", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "A Different Email",
                whatIsYourEmailInput: "john.doe@example.com"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("You are already using that email address. Enter a different email address if it’s changed or cancel the update");
    });

    it("should return status 400 and display error message when no change has been made to ltd company name", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                getExtraData: jest.fn().mockReturnValue(mockLimitedAcspFullProfile)
            };
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL)
            .send({
                whatIsYourEmailRadio: "john.doe@example.com",
                whatIsYourEmailInput: "john.doe@example.com"
            });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select to enter a different email address if it’s changed or cancel the update");
    });
});
