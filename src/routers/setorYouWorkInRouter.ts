import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { sectorYouWorkInValidator } from "../lib/validation/sectorYouWorkIn";
import { FormattedValidationErrors, formatValidationError } from "../lib/validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../utils/localise";

const router: Router = Router();
const routeViews: string = "router_views/sector-you-work-in";

router.get("/sector-you-work-in", async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(`${routeViews}/sector-you-work-in`, {
        ...getLocaleInfo(locales, lang)
    });
});

router.post("/sector-you-work-in", sectorYouWorkInValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(`${routeViews}/sector-you-work-in`, pageProperties);
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
