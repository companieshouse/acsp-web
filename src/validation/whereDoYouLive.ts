import { Session } from "@companieshouse/node-session-handler";
import { body } from "express-validator";
import countryList from "../../lib/countryList";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";

export const whereDoYouLiveValidator = [
    body("countryInput", "whereDoYouLiveEmptyInput")
        .trim()
        .custom((value, { req }) => {
            if (req.body.whereDoYouLiveRadio === "countryOutsideUK") {
                const session: Session = req.session as Session;
                const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
                if (acspDetails) {
                    const normalisedResidentialCountry = value;
                    const existingResidentialCountry = acspDetails.soleTraderDetails?.usualResidentialCountry;

                    if (normalisedResidentialCountry === existingResidentialCountry) {
                        throw new Error("whereDoYouLiveNoChangeUpdateAcsp");
                    }
                }

                if (value === "" || !countryList.split(";").map((country) => country.toLowerCase()).includes(value.trim().toLowerCase())) {
                    throw new Error("whereDoYouLiveEmptyInput");
                }
            }
            return true;
        }),
    body("whereDoYouLiveRadio", "whereDoYouLiveNoData")
        .notEmpty().bail()
        .custom((value, { req }) => {
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

            if (acspDetails) {
                const normalisedResidentialCountry = value;
                const existingResidentialCountry = acspDetails.soleTraderDetails?.usualResidentialCountry;

                if (normalisedResidentialCountry === existingResidentialCountry) {
                    throw new Error("whereDoYouLiveNoChangeUpdateAcsp");
                }
            }
            return true;
        })
];
