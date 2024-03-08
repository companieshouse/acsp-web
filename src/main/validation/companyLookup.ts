import { body } from "express-validator";
import { CompanyLookupService } from "../services/companyLookupService";

const characterPattern:RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [
    body("companyNumber").trim().notEmpty().withMessage("invalidcompanyNumberNoData").bail()
        .matches(characterPattern).withMessage("invalidcompanyNumberPattern").bail()
        .isLength({ min: 8, max: 8 }).withMessage("invalidcompanyNumbercharacterLimit").bail()
        .custom(async (value: string) => {
            const companyLookupService = new CompanyLookupService();
            // Call backend error to show on the frontend
            await companyLookupService.getCompany(value);

        })

];
