import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { correspondenceAddressAutoLookupValidator } from "../../../main/validation/correspondenceAddressAutoLookup";
import { validationResult } from "express-validator";

import { response } from "express";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Correspondence Address Auto Lookup Validator", () => {
    xit("Valid Address Data Should Pass Validation", async () => {
        jest.mock("../../../main/services/postcode-lookup-service", () => ({
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

        const req = { body: validAddressData };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressAutoLookupValidator) {
            await validationChain(req, res, () => {});
        }

        const errors = validationResult(req);
        console.log(errors);
        expect(errors.isEmpty()).toBe(true);
    });

    xit("Invalid Address Data Should Fail Validation", async () => {
        jest.mock("../../../main/services/postcode-lookup-service", () => ({
            getUKAddressesFromPostcode: jest.fn(async (url, postcode) => {
                return [];
            })
        }));

        const invalidAddressData = {
            postCode: "InvalidPostcode",
            premise: "Invalid Property Details"
        };

        const req = { body: invalidAddressData };
        const res = { locals: {} };

        for (const validationChain of correspondenceAddressAutoLookupValidator) {
            await validationChain(req, res, () => {});
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);
        expect(errors.array()).toHaveLength(1);
    });
});
