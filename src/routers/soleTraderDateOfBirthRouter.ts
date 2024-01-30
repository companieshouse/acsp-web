import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { dateOfBirthValidator } from "../lib/validation/dateOfBirth";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";
const router: Router = Router();
const routeViews: string = "router_views/date-of-birth";

router.get("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(`${routeViews}/capture-date-of-birth`, {
        title: "What is your date of Birth?",
        previousPage: "/sole-trader/name",
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });
});

router.post("/date-of-birth", dateOfBirthValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(`${routeViews}/capture-date-of-birth`, {
                title: "What is your date of Birth?",
                previousPage: "/sole-trader/name",
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            res.redirect("/sole-trader/nationality");
        }
    } catch (error) {
        next(error);
    }
});

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

export default router;
