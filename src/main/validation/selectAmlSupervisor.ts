import { body } from "express-validator";

export const selectAmlSupervisorValidator = [
    body("AML-supervisory-bodies", "selectAmlSupervisor").notEmpty()
];
