import { Request, Response } from "express";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";
import app from "../../../main/app";
import { Session } from "@companieshouse/node-session-handler";
import supertest from "supertest";
import { indexController } from "../../../main/controllers";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

let session: Session;
let request: MockRequest<Request>;
let response: MockResponse<Response>;

// clone response processor
const clone = (objectToClone: any): any => {
    return JSON.parse(JSON.stringify(objectToClone));
};

describe("Home Page tests -", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
        // mock request/responses
        request = createRequest({
            session: session
        });
        response = createResponse();
    });

    describe("GET /register-acsp/home", () => {
        it("should return status 200", async () => {
            const getSpy = jest.spyOn(indexController, "get");
            await router.get("/register-acsp/home").expect(200);
        });
    });

});
