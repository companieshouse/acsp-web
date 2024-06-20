import { Resource } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import { createPublicApiKeyClient } from "../../../../src/services/api/api_service";
import { getCompanyProfile } from "../../../../src/services/company/company_profile_service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { validCompanyProfile } from "../../../mocks/company_profile_mock";
import { StatusCodes } from "http-status-codes";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/api/api_service");

const mockCreatePublicApiClient = createPublicApiKeyClient as jest.Mock;
const mockGetCompanyProfile = jest.fn();

mockCreatePublicApiClient.mockReturnValue({
    companyProfile: {
        getCompanyProfile: mockGetCompanyProfile
    }
});

let session: any;
const COMPANY_NUMBER = "12345678";

describe("Company profile tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
    });

    it("Should return a company profile", async () => {
        mockGetCompanyProfile.mockResolvedValueOnce({
            httpStatusCode: 200,
            resource: validCompanyProfile
        } as Resource<CompanyProfile>);
        const companyProfile = await getCompanyProfile(session, COMPANY_NUMBER);
        expect(companyProfile).toStrictEqual(validCompanyProfile);
    });

    it("Should throw an error when no company profile api response", async () => {
        mockGetCompanyProfile.mockResolvedValueOnce(undefined);

        await expect(getCompanyProfile(session, COMPANY_NUMBER)).rejects.toBe(undefined);
    });

    it("Should throw an error when company profile api returns a status is not 200", async () => {
        mockGetCompanyProfile.mockResolvedValueOnce({
            httpStatusCode: 500
        });

        await expect(getCompanyProfile(session, COMPANY_NUMBER)).rejects.toEqual({ httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR });
    });

    it("Should throw an error when company profile api returns no resource", async () => {
        mockGetCompanyProfile.mockResolvedValueOnce({
            httpStatusCode: 200
        } as Resource<CompanyProfile>);

        await expect(getCompanyProfile(session, COMPANY_NUMBER)).rejects.toEqual({ httpStatusCode: StatusCodes.OK });
    });
});
