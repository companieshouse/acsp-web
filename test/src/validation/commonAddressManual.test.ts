import { manualAddressValidator } from "../../../src/validation/commonAddressManual";
import { validationResult } from "express-validator";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";

describe("Correspondence Address Manual Validator", () => {
    it("Valid Address Data Should Pass Validation", () => {
        const validAddressData = {
            addressPropertyDetails: "Valid Property Details",
            addressLine1: "Valid Address Line 1",
            addressLine2: "Valid Address Line 2",
            addressTown: "Valid City Or Town",
            addressCounty: "Valid-County",
            addressCountry: "Valid Country",
            addressPostcode: "Valid1234"
        };

        const req = { body: validAddressData };
        const res = { locals: {} };

        for (const validationChain of manualAddressValidator("registration")) {

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
            addressLine1: "Invalid^",
            addressLine2: "Invalid Address Line 2",
            addressTown: "",
            addressCounty: "Invalid County Name!@#",
            addressCountry: "",
            addressPostcode: "INVALID_POSTCODE"
        };

        const req = { body: invalidAddressData, session: getSessionRequestWithPermission() };
        const res = { locals: {} };

        for (const validationChain of manualAddressValidator("registration")) {
            if (typeof validationChain === "function") {
                await validationChain(req, res, () => {});
            }
        }

        const errors = validationResult(req);

        const expectedErrors = [
            { location: "body", msg: "noPropertyDetails", param: "addressPropertyDetails", value: "" },
            { location: "body", msg: "invalidAddressLine1", param: "addressLine1", value: "Invalid^" },
            { location: "body", msg: "noCityOrTown", param: "addressTown", value: "" },
            { location: "body", msg: "invalidAddressCounty", param: "addressCounty", value: "Invalid County Name!@#" }
        ];

        expect(errors.array()).toMatchObject(expectedErrors);
    });
});
