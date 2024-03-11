import { body } from "express-validator";

export const soleTraderWhatIsYourRoleValidator = [
    body("WhatIsYourRole", "soleTraderWhatIsYourRoleRadio").notEmpty()
];