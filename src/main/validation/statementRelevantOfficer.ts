import { body } from "express-validator";

export const statementRelevantOfficerValidator = [
    body("WhatIsYourRole", "soleTraderWhatIsYourRoleRadio").notEmpty()
];
