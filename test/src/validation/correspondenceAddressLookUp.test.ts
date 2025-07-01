import { correspondenceAddressAutoLookupValidator } from "../../../src/validation/correspondenceAddressAutoLookup";
import { validationResult } from "express-validator";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";

jest.mock("@companieshouse/api-sdk-node");

describe("Correspondence Address Auto Lookup Validator", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("Valid Address Data Should Pass Validation", async () => {
        jest.mock("../../../src/services/postcode-lookup-service", () => ({
            getUKAddressesFromPostcode: jest.fn(async (url, postcode) => {
                if (postcode === "ValidPostcode") {
                    return [{
                        postcode: "ST63LJ",
                        premise: "10",
                        addressLine1: "DOWN STREET",
                        addressLine2: "",
                        postTown: "LONDON",
                        country: "UNITED KINGDOM"
                    }];
                } else {
                    return [];
                }
            })
        }));

        const validAddressData = {
            postCode: "ST63LJ",
            premise: "10 "
        };

        const req = { body: validAddressData, session: getSessionRequestWithPermission() };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressAutoLookupValidator("registration")) {
            await validationChain(req, res, () => {});
        }

        const errors = validationResult(req);
        expect(errors.isEmpty()).toBe(true);
    });

    it("Invalid Address Data Should Fail Validation", async () => {
        jest.mock("../../../src/services/postcode-lookup-service", () => ({
            getUKAddressesFromPostcode: jest.fn(async (url, postcode) => {
                return [];
            })
        }));

        const invalidAddressData = {
            postCode: "InvalidPostcode",
            premise: "Invalid Property Details"
        };

        const req = { body: invalidAddressData, session: getSessionRequestWithPermission() };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressAutoLookupValidator("registration")) {
            await validationChain(req, res, () => {});
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toHaveLength(1);
    });
});
