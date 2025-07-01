import { createPrivateApiClient } from "private-api-sdk-node";
import { dummyFullProfile, MOCK_ACSP_NUMBER } from "../../mocks/acsp_profile.mock";
import { Resource } from "@companieshouse/api-sdk-node";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getAcspFullProfile } from "../../../src/services/acspProfileService";

jest.mock("private-api-sdk-node");

const mockCreatePrivateApiClient = createPrivateApiClient as jest.Mock;
const mockGetAcspFullProfile = jest.fn();

mockCreatePrivateApiClient.mockReturnValue({
    acspProfileService: {
        getAcspFullProfile: mockGetAcspFullProfile
    }
});

describe("acsp profile api service tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    describe("getAcspFullProfile tests", () => {
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should return a full acsp profile", async () => {

            mockGetAcspFullProfile.mockResolvedValueOnce({
                httpStatusCode: 200,
                resource: dummyFullProfile
            } as Resource<AcspFullProfile>);

            const identity = await getAcspFullProfile(MOCK_ACSP_NUMBER);

            expect(identity).toStrictEqual(dummyFullProfile);
        });

        it("Should throw an error when no identity-verification-api response", async () => {
            mockGetAcspFullProfile.mockResolvedValueOnce(undefined);

            await expect(getAcspFullProfile(MOCK_ACSP_NUMBER)).rejects.toBe(undefined);
        });

        it("Should throw an error when identity-verification-api returns a status greater than 400", async () => {
            mockGetAcspFullProfile.mockResolvedValueOnce({
                httpStatusCode: 400
            });

            await expect(getAcspFullProfile(MOCK_ACSP_NUMBER)).rejects.toEqual({ httpStatusCode: 400 });
        });

        it("Should throw an error when identity-verification-api returns no resource", async () => {
            mockGetAcspFullProfile.mockResolvedValueOnce({
                httpStatusCode: 204
            } as Resource<AcspFullProfile>);

            await expect(getAcspFullProfile(MOCK_ACSP_NUMBER)).rejects.toEqual({ httpStatusCode: 204 });
        });
    });
});
