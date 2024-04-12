import { body } from "express-validator";

export const amlBodyMembershipNumberControllerValidator = [
    body("aml-memebership-number", "amlIDNumberInput").trim().notEmpty()
];



