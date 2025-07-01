import { Response } from "express";
import { Resource } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import { deleteAcspApplication } from "../../../src/services/acspRegistrationService";
import { getRedirectionUrl } from "../../../src/services/checkSavedApplicationService";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { BASE_URL, CANNOT_REGISTER_AGAIN, CANNOT_SUBMIT_ANOTHER_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../src/types/pageURL";
import { ACCEPTED, IN_PROGRESS, REJECTED } from "../../../src/common/__utils/constants";
import { createResponse, MockResponse } from "node-mocks-http";
import { getAcspFullProfile } from "../../../src/services/acspProfileService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/acspProfileService");
jest.mock("../../../src/services/acspRegistrationService");

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;
const mockDeleteSavedApplication = deleteAcspApplication as jest.Mock;
let res: MockResponse<Response>;

let session: any;
let url = "";
const hasOpenApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "",
            resumeJourneyUri: "/register-as-companies-house-authorised-agent/resume?transactionId=123&acspId=abc"
        }]
    }
};

const hasApprovedApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: ACCEPTED, companyNumber: "AP123456" } },
            resumeJourneyUri: "/register-as-companies-house-authorised-agent/resume?transactionId=123&acspId=abc"
        }]
    }
};

const hasApplicationInProgress: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: IN_PROGRESS } },
            resumeJourneyUri: "/register-as-companies-house-authorised-agent/resume?transactionId=123&acspId=abc"
        }]
    }
};

const hasRejectedApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: REJECTED } },
            resumeJourneyUri: "/register-as-companies-house-authorised-agent/resume?transactionId=123&acspId=abc"
        }]
    }
};

describe("check saved application service tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
        res = createResponse();
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("Should redirect to correct url when the application is open", async () => {
        const redirectionUrl = await getRedirectionUrl(hasOpenApplication, session);
        url = BASE_URL + SAVED_APPLICATION;
        expect(redirectionUrl).toEqual(url);
    });

    it("Should redirect to TYPE_OF_BUSINESS when application filing is accepted and acsp status is CEASED", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce({ status: "ceased" });
        const redirectionUrl = await getRedirectionUrl(hasApprovedApplication, session);
        url = BASE_URL + TYPE_OF_BUSINESS;
        expect(redirectionUrl).toEqual(url);
        expect(mockGetAcspFullProfile).toHaveBeenCalledWith("AP123456");
    });

    it("Should redirect to CANNOT_REGISTER_AGAIN  when application filing is accepted and acsp status is not CEASED", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce({ status: "active" });
        const redirectionUrl = await getRedirectionUrl(hasApprovedApplication, session);
        url = BASE_URL + CANNOT_REGISTER_AGAIN;
        expect(redirectionUrl).toEqual(url);
        expect(mockGetAcspFullProfile).toHaveBeenCalledWith("AP123456");
    });

    it("Should redirect to correct url when the application is in progress", async () => {
        const redirectionUrl = await getRedirectionUrl(hasApplicationInProgress, session);
        url = BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION;
        expect(redirectionUrl).toEqual(url);
    });

    it("Should redirect to correct url when the application is in rejected", async () => {
        mockDeleteSavedApplication.mockResolvedValueOnce("200");
        const redirectionUrl = await getRedirectionUrl(hasRejectedApplication, session);
        url = BASE_URL + TYPE_OF_BUSINESS;
        expect(redirectionUrl).toEqual(url);
    });
});
