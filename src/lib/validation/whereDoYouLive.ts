import { body } from "express-validator";
import countryList from "../countryList";
import whereDoYouLiveErrorManifest from "../utils/error_manifests/whereDoYouLive";

export const whereDoYouLiveValidator = [
    body("countryInput", whereDoYouLiveErrorManifest.validation.noData.summary).trim().notEmpty().isIn(countryList)
];
