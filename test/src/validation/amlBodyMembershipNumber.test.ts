import { ValidationChain } from "express-validator";
import amlBodyMembershipNumberControllerValidator from "../../../src/validation/amlBodyMembershipNumber";

describe("amlBodyMembershipNumberControllerValidator", () => {
    it("should return an array of ValidationChain objects", () => {
        const validationChains: ValidationChain[] = amlBodyMembershipNumberControllerValidator();
        expect(Array.isArray(validationChains)).toBeTruthy();
        validationChains.forEach((validationChain) => {
            expect(validationChain).toBeInstanceOf(Function);
        });
    });
});
