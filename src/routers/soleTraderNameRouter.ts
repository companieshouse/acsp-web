import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { nameValidator } from "../lib/validation/name";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";

const router: Router = Router();
const routeViews: string = "router_views/name";

router.get("/name", async (req: Request, res: Response, next: NextFunction) => {
    res.render(`${routeViews}/capture-name`, {
        title: "What is your name?",
        previousPage: "/sole-trader/"
    });
});

router.post("/name", nameValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(`${routeViews}/capture-name`, {
                title: "What is your name?",
                previousPage: "/sole-trader/",
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            req.session.user = req.session.user || {};
            req.session.user.firstName = req.body["first-name"];
            req.session.user.lastName = req.body["last-name"];
            req.session.save(() => {
                res.redirect("/sole-trader/date-of-birth");
            });
        }
    } catch (error) {
        next(error);
    }
});

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

export default router;
