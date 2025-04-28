import { Session } from "@companieshouse/node-session-handler";
import { body } from "express-validator";
import countryList from "../../lib/countryList";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { trimAndLowercaseString } from "../services/common";

const isSameAsExistingCountry = (input: string, req: any): boolean => {
    const session: Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
    const existingResidentialCountry = trimAndLowercaseString(acspDetails?.soleTraderDetails?.usualResidentialCountry);
    return trimAndLowercaseString(input) === existingResidentialCountry;
};

export const whereDoYouLiveValidator = [
    body("countryInput", "whereDoYouLiveEmptyInput")
        .trim()
        .custom((value, { req }) => {
            if (req.body.whereDoYouLiveRadio === "countryOutsideUK") {
                if (isSameAsExistingCountry(value, req)) {
                    throw new Error("whereDoYouLiveNoChangeUpdateAcsp");
                }

                const countries = countryList.split(";").map(country => country.toLowerCase());
                if (value === "" || !countries.includes(value.trim().toLowerCase())) {
                    throw new Error("whereDoYouLiveEmptyInput");
                }
            }
            return true;
        }),

    body("whereDoYouLiveRadio", "whereDoYouLiveNoData")
        .notEmpty().bail()
        .custom((value, { req }) => {
            if (isSameAsExistingCountry(value, req)) {
                throw new Error("whereDoYouLiveNoChangeUpdateAcsp");
            }
            return true;
        })
];
