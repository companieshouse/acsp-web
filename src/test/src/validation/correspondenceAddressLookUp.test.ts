import supertest from "supertest";
import app from "../../../main/app";
import { response } from "express";
const router = supertest(app);

describe("POST /sole-trader/correspondenceAddressAutoLookup", () => {

    it("should return status 400 for incorrect data entered", async () => {
        const formData = {
            postCode: "",
            premise: ""
        };

        const response = await router.post("/sole-trader/correspondenceAddressAutoLookup").send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Enter a postcode");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "ST6",
            premise: "4"
        };

        const response = await router.post("/sole-trader/correspondenceAddressAutoLookup").send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("We cannot find this postcode. Enter a different one, or enter the address manually");
    });

    it("should return status 400 for no postcode entered", async () => {
        const formData = {
            postCode: "ST63LJ",
            premise: "6$££kasu"
        };

        const response = await router.post("/sole-trader/correspondenceAddressAutoLookup").send(formData);
        expect(response.status).toBe(400);
        expect(response.text).toContain("Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes");
    });
});
