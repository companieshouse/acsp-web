import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../../main/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
jest.mock("../../../../../lib/Logger");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    countryOfResidence: "Wales"
};

describe("GET" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    beforeEach(() => {
        mockGetAcspRegistration.mockClear();
    });

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Where do you live?");
    });
    it("catch error when rendering the page", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");

    });
});

// Test for correct form with valid inputs, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHERE_DO_YOU_LIVE, () => {
    it("should return status 302 after redirect", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "Wales" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME + "?lang=en");
    });

    // Test for invalid input
    it("should return status 400", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "fewrfw" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for empty input
    it("should fail validation with empty first nationality", async () => {
        const res = await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE)
            .send({ countryInput: "Wales" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
