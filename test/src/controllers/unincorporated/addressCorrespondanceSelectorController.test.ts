import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, BASE_URL, UNINCORPORATED_SELECT_AML_SUPERVISOR, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("GET " + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the correspondence address?");
    });

    it("should render the correspondence address selector page with status 200", async () => {
        const acspData2: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, () => {
    it("should render the correspondence address selector page with validation errors", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should render the correspondence address selector page with validation errors", async () => {
        const formData = {
            whatIsTheBusinessNameInput: "Company",
            whatsTheBusinessNameRadio: "A Different Name",
            addressSelectorRadio: "",
            applicantDetails: {
                firstName: "John",
                middleName: "",
                lastName: "Doe"
            }
        };

        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send(formData);
        expect(res.status).toBe(400);
        expect(res.text).toContain("What is the correspondence address?");

    });

    it("should redirect to correspondence-address-lookup page when address option is CORRESPONDANCE_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "CORRESPONDANCE_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR + "?lang=en");
    });

    it("should redirect to correspondence-address-lookup page when address option is DIFFERENT_ADDRESS", async () => {
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "DIFFERENT_ADDRESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP + "?lang=en");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router
            .post(BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS)
            .send({ addressSelectorRadio: "CORRESPONDANCE_ADDRESS" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
