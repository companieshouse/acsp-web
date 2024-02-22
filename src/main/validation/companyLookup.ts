import { body } from "express-validator";
import { ACSPServiceClient } from "../../main/clients/ASCPServiceClient";

const characterPattern:RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [
    body("companyNumber").trim().notEmpty().withMessage("invalidcompanyNumberNoData").bail()
        .matches(characterPattern).withMessage("invalidcompanyNumberPattern").bail()
        .isLength({ min: 8, max: 8 }).withMessage("invalidcompanyNumbercharacterLimit").bail()
        .custom(async (value: string) => {
            // Check if company number exists
            const acspServiceClient = new ACSPServiceClient("http://localhost:18642/acsp-api");
            const companyExists = await acspServiceClient.getCompany(value);

        })

];
