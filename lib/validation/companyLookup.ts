import { body } from "express-validator";
import companyLookupErrorManifest from "../../lib/utils/error_manifests/companyLookup";
//import * as constants from "../../src/main/common/__utils/constants";
import { ACSPServiceClient } from "../../src/main/clients/ASCPServiceClient";

const characterPattern:RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [
        body("companyNumber").trim().notEmpty().withMessage(companyLookupErrorManifest.validation.noData.summary).bail()
                .matches(characterPattern).withMessage(companyLookupErrorManifest.validation.companyNumber.summary).bail()
                .isLength({ min: 8, max: 8 }).withMessage(companyLookupErrorManifest.validation.characterLimit.summary).bail()
                .custom(async (value: string) => {
                            // Check if company number exists
                            const acspServiceClient = new ACSPServiceClient("http://localhost:18642/acsp-api");
                            const companyExists = await acspServiceClient.getCompany(value);
                            if (!companyExists) {
                                throw new Error("Error"); //add write error
                        }
                        return true;
                    })




];