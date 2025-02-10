import { body } from "express-validator";

export const addAmlSupervisorValidator = [
    body("AML-supervisory-bodies", "addAmlSupervisor").notEmpty()
];
