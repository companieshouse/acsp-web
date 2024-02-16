import { body } from "express-validator";

export const howAreYouAmlSupervisedValidator = [
    body("howAreYouAmlSupervised", "howAreYouAmlSupervisedSelectRadio").notEmpty()
];
