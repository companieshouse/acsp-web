import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../lib/nationalityList";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";
import { nationalityValidator } from "../lib/validation/nationality";

const router: Router = Router();
const routeViews: string = "router_views/nationality";

router.get("/nationality", async (req: Request, res: Response, next: NextFunction) => {
    res.render(`${routeViews}/nationality`, {
        nationalityList: nationalityList,
        title: "What is your nationality?",
        previousPage: "/sole-trader/date-of-birth"
    });
});

router.post("/nationality", nationalityValidator, async (req: Request, res: Response, next: NextFunction) => {
    console.log("Form submission data:", req.body);
    try {
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(`${routeViews}/nationality`, {
                pageProperties: pageProperties,
                title: "What is your nationality?",
                previousPage: "/sole-trader/where-do-you-live"
            });// determined from user not in banned list
        } else {
            // If validation passes, redirect to the next page
            res.redirect("/sole-trader/stop-screen-not-a-soletrader");
        }
    } catch (error) {
        next(error);
    }
});

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

export default router;
