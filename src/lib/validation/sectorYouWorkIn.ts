import { body } from "express-validator";
import sectorYouWorkInErrorManifest from "../utils/error_manifests/sectorYouWorkIn";

export const sectorYouWorkInValidator = [
    body("sectorYouWorkIn", "sectorYouWorkInError").notEmpty()
];
