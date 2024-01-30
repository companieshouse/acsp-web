import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { correspondanceAddressManualValidator } from "../lib/validation/correspondanceAddressManual";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";

const router: Router = Router();
const routeViews: string = "router_views/correspondance-address-manual";

router.get("/address-correspondance-manual", async (req: Request, res: Response, next: NextFunction) => {
    res.render(`${routeViews}/capture-correspondance-address-manual`, {
        title: "What is your correspondance address?",
        previousPage: "/sole-trader/address-correspondance-lookup"
    });
});

router.post("/address-correspondance-manual", correspondanceAddressManualValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            console.log(pageProperties);
            res.status(400).render(`${routeViews}/capture-correspondance-address-manual`, {
                title: "What is your correspondance address?",
                previousPage: "/sole-trader/address-correspondance-lookup",
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            res.redirect("/sole-trader/address-correspondance-confirm");
        }
    } catch (error) {
        next(error);
    }
});

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

export default router;
