import {body} from "express-validator";
import correspondenceAddressListErrorManifest from "../utils/error_manifests/correspondenceAddressList";

export const correspondenceAddressListValidator = [
    body("correspondenceAddress", correspondenceAddressListErrorManifest.validation.noData.summary).notEmpty()
];
