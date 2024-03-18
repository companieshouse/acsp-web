/* eslint-disable import/no-duplicates */
import mocks from "../../mocks/all_middleware_mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../main/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { validCompanyProfile, validDeactiveCompanyProfile } from "../../mocks/companyDetails.mock";
import { Company } from "../../../main/model/Company";
import { LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_THE_COMPANY_AUTH_CODE, BASE_URL } from "../../../main/types/pageURL";
import * as config from "../../../main/config";
import { get, post } from "../../../main/controllers/features/limited/isThisYourCompanyController";

const router = supertest(app);
const status = "active";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = {} as any;
    return next();
});

describe("Limited Company Controller Tests", () => {
    let req: Request;
    let res: Response;
    let next: jest.Mock;

    beforeEach(() => {
        req = {} as Request;
        res = {
            render: jest.fn(),
            redirect: jest.fn()
        } as unknown as Response;
        next = jest.fn();
    });

    describe("GET " + LIMITED_IS_THIS_YOUR_COMPANY, () => {
        it("should render the view with company details", async () => {
            const company: Company = {
                companyName: "Test Company",
                companyNumber: "123456",
                status: "active",
                incorporationDate: "2022-01-01",
                companyType: "Limited",
                registeredOfficeAddress: {}
            };

            const mockSession: any = {
                getExtraData: jest.fn().mockReturnValue(company)
            };

            req.session = mockSession;

            await get(req, res, next);

            expect(res.render).toHaveBeenCalledWith(config.LIMITED_IS_THIS_YOUR_COMPANY, {
                previousPage: expect.any(String),
                chooseDifferentCompany: expect.any(String),
                title: "Is this your company?",
                company: company,
                currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
            });
        });
    });

    describe("POST " + LIMITED_IS_THIS_YOUR_COMPANY, () => {
        it("should redirect to authentication code page for active company", async () => {
            // Mock company details
            const company: Company = {
                status: "active"
            };

            const mockSession: any = {
                getExtraData: jest.fn().mockReturnValue(company)
            };

            req.session = mockSession;

            await post(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_AUTH_CODE);
        });

        it("should redirect to company inactive page for inactive company", async () => {
            // Mock company details
            const company: Company = {
                status: "inactive"
            };

            const mockSession: any = {
                getExtraData: jest.fn().mockReturnValue(company)
            };

            req.session = mockSession;

            await post(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith(BASE_URL + LIMITED_COMPANY_INACTIVE);
        });

        it("should call next middleware in case of an error", async () => {
            const mockSession: any = {
                getExtraData: jest.fn().mockImplementation(() => {
                    throw new Error("Test Error");
                })
            };

            req.session = mockSession;

            await post(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
