import { body } from "express-validator";
import countryList from "../../lib/countryList";

export const whereDoYouLiveValidator = [
    body("countryInput", "whereDoYouLiveEmptyInput")
        .trim()
        .custom((value, { req }) => {
            if (req.body.whereDoYouLiveRadio === "countryOutsideUK") {
                if (value === "" || !countryList.split(";").map((country) => country.toLowerCase()).includes(value.trim().toLowerCase())) {
                    throw new Error("whereDoYouLiveEmptyInput");
                }
            }
            return true;
        }),
    body("whereDoYouLiveRadio", "whereDoYouLiveNoData")
        .notEmpty()
];
