import { body } from "express-validator";
import countryList from "../../lib/countryList";

export const whereDoYouLiveValidator = [
    body("countryInput", "whereDoYouLiveNoData").trim().custom((value, { req }) => {
        if (req.body.whereDoYouLiveRadio === "countryoutsideUK" && value === "") {
            throw new Error("whereDoYouLiveNoData");
        } else if (req.body.whereDoYouLiveRadio === "countryoutsideUK" && !countryList.split(";").includes(value.trim())) {
            throw new Error("whereDoYouLiveEmptyInput");

        } return true;
    }),
    body("whereDoYouLiveRadio", "whereDoYouLiveEmptyInput").notEmpty()
];
