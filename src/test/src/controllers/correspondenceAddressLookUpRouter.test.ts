import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET /sole-trader/correspondenceAddressAutoLookup", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/sole-trader/correspondenceAddressAutoLookup").expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST /sole-trader/correspondenceAddressAutoLookup", () => {
    it("should redirect to address list with status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: ""
        };

        const response = await router.post("/register-acsp/sole-trader/correspondenceAddressAutoLookup").send(formData);
        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe("/register-acsp/sole-trader/correspondence-address-list?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to confirm page status 302 on successful form submission", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "6"
        };

        const response = await router.post("/register-acsp/sole-trader/correspondenceAddressAutoLookup").send(formData);
        expect(response.status).toBe(302); // Expect a redirect status code
        expect(response.header.location).toBe("/register-acsp/sole-trader/correspondence-address-confirm");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 for invalid postcode entered", async () => {
        const formData = {
            postCode: "S6",
            premise: "6"
        };

        const response = await router.post("/register-acsp/sole-trader/correspondenceAddressAutoLookup").send(formData);

        expect(response.status).toBe(400);
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "",
            premise: "6"
        };

        const response = await router.post("/register-acsp/sole-trader/correspondenceAddressAutoLookup").send(formData);

        expect(response.status).toBe(400);
    });

    it("should return status 400 for no data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const response = await router.post("/register-acsp/sole-trader/correspondenceAddressAutoLookup").send(formData);

        expect(response.status).toBe(400);
    });
});
