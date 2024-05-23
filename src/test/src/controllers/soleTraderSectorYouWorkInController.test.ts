import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, BASE_URL, SOLE_TRADER_WHICH_SECTOR_OTHER, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../main/types/pageURL";
import { getAcspRegistration, postAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import logger from "../../../../lib/Logger";
import { ErrorService } from "../../../main/services/errorService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/acspRegistrationService");
jest.mock("../../../../lib/Logger");
jest.mock("../../../main/services/errorService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
const mockErrorService = new ErrorService() as jest.Mocked<ErrorService>;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    firstName: "John",
    lastName: "Doe",
    workSector: "AUDITORS_INSOLVENCY_PRACTITIONERS"
};

describe("GET" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);

        const res = await router.get(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("John Doe");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_SECTOR_YOU_WORK_IN, () => {

    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(302).expect("Location", BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS + "?lang=en");
    });

    it("should return status 302 after redirect to OTHER sector page", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "OTHER" }).expect(302).expect("Location", BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER + "?lang=en");
    });

    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "" }).expect(400);
    });

    it("should handle error and render error page on postAcspRegistration error", async () => {
        mockPostAcspRegistration.mockRejectedValueOnce(new Error("Test Error"));

        await router.post(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN).send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(500);
        expect(logger.error).toHaveBeenCalledWith("Unable to post registration details for the transaction");
        // expect(mockErrorService.renderErrorPage).toHaveBeenCalled();
    });
});
