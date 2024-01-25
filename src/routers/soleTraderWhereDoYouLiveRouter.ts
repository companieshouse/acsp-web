import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import countryList from "../lib/countryList";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";
import { whereDoYouLiveValidator } from "../lib/validation/whereDoYouLive";

const router: Router = Router();
const routeViews: string = "router_views/where-do-you-live";

router.get("/where-do-you-live", async (req: Request, res: Response, next: NextFunction) => {
    res.render(`${routeViews}/where-do-you-live`, {
        countryList: countryList,
        title: "Where do you live?",
        previousPage: "/sole-trader/nationality"
    });
});

router.post("/where-do-you-live", whereDoYouLiveValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(`${routeViews}/where-do-you-live`, {
                countryList: countryList,
                pageProperties: pageProperties,
                title: "Where do you live?",
                previousPage: "/sole-trader/nationality"
            });
        } else {
            res.redirect("/sole-trader/business-name");
        }
    } catch (error) {
        next(error);
    }
});

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

export default router;
