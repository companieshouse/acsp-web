import supertest from "supertest";
import app from "../../../main/app";
import { correspondenceAddressManualValidator } from "../../../main/validation/correspondenceAddressManual";
import { validationResult } from "express-validator";

const router = supertest(app);

describe("Correspondence Address Manual Validator", () => {
    it("Valid Address Data Should Pass Validation", () => {
        const validAddressData = {
            addressPropertyDetails: "Valid Property Details",
            addressLine1: "Valid Address Line 1",
            addressLine2: "Valid Address Line 2",
            addressTown: "Valid City Or Town",
            addressCounty: "Valid County",
            addressCountry: "Valid Country",
            addressPostcode: "Valid1234",
        };

        const req = { body: validAddressData };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressManualValidator) {

            if (typeof validationChain === "function") {
                validationChain(req, res, () => {});
            }
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);
    });

    it("Invalid Address Data Should Fail Validation", async () => {
        const invalidAddressData = {
            addressPropertyDetails: "",
            addressLine1: "Invalid!@#",
            addressLine2: "Invalid Address Line 2",
            addressTown: "",
            addressCounty: "Invalid County Name!@#",
            addressCountry: "Invalid Country Name!@#",
            addressPostcode: "Invalid_Postcode"
        };

        const req = { body: invalidAddressData };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressManualValidator) {
            if (typeof validationChain === "function") {
                await validationChain(req, res, () => {});
            }
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toHaveLength(6);
    });
});
