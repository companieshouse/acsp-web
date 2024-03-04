import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";
import { Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { createSessionData } from "../../mocks/session_generator_mock";
import * as crypto from "crypto";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST } from "../../../main/types/pageURL";

const cookieSecret = generateRandomBytesBase64(16);
jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

let request: MockRequest<Request>;
let response: MockResponse<Response>;

describe("Address Auto look up tests ", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // session instance
        request = createRequest({
            session: new Session({
                ...createSessionData(cookieSecret)
            })
        });

        response = createResponse();
    });

    describe("GET" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {
        it("should return status 200", async () => {
            await router.get(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).expect(200);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });
    });

    describe("POST" + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, () => {

        xit("should redirect to address list with status 302 on successful form submission", async () => {
            const formData = {
                postCode: "ST63LJ",
                premise: ""
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
            expect(response.status).toBe(302); // Expect a redirect status code
            expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST + "?lang=en");
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        xit("should redirect to confirm page status 302 on successful form submission", async () => {
            const formData = {
                postCode: "ST63LJ",
                premise: "6"
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);
            expect(response.status).toBe(302); // Expect a redirect status code
            expect(response.header.location).toBe(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

        it("should return status 400 for invalid postcode entered", async () => {
            const formData = {
                postCode: "S6",
                premise: "6"
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });

        it("should return status 400 for no postcode entered", async () => {
            const formData = {
                postCode: "",
                premise: "6"
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });

        it("should return status 400 for no data entered", async () => {
            const formData = {
                postCode: "",
                premise: ""
            };

            const response = await router.post(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS).send(formData);

            expect(response.status).toBe(400);
        });
    });

});

export function generateRandomBytesBase64 (numBytes: number): string {
    return crypto.randomBytes(numBytes).toString("base64");
}
