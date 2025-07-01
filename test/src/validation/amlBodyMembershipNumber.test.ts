import { ValidationChain } from "express-validator";
import { amlBodyMembershipNumberValidator } from "../../../src/validation/amlBodyMembershipNumberValidator";

describe("amlBodyMembershipNumbeValidator", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return an array of ValidationChain objects", () => {
        const validationChains: ValidationChain[] = amlBodyMembershipNumberValidator();
        expect(Array.isArray(validationChains)).toBeTruthy();
        validationChains.forEach((validationChain) => {
            expect(validationChain).toBeInstanceOf(Function);
        });
    });
});
