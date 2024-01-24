import { body } from "express-validator";
import whereDoYouLiveErrorManifest from "../utils/error_manifests/whereDoYouLive";

export const whereDoYouLiveValidator = [
    body("", whereDoYouLiveErrorManifest.validation.noData.summary).notEmpty()
];
