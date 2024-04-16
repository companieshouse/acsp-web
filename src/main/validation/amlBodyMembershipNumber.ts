
import { body } from "express-validator";

export const amlBodyMembershipNumberControllerValidator = [

    body("membershipNumber_1").trim().notEmpty().withMessage("amlIDNumberInput").bail(),
    body("membershipNumber_2").trim().notEmpty().withMessage("amlIDNumberInput").bail(),
    body("membershipNumber_3").trim().notEmpty().withMessage("amlIDNumberInput").bail()
    /* body("membershipNumber_4").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_5").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_6").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_7").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_8").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_9").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_10").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_11").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_12").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_13").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_14").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_15").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_16").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_17").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_18").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_19").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_20").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_21").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_22").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_23").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_24").trim().notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_25").trim().notEmpty().withMessage("amlIDNumberInput") */

];
