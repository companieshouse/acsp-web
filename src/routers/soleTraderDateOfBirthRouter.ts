import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderDateOfBirthHandler } from "./handlers/capture-date-of-birth/soleTraderDateOfBirth";

const router: Router = Router();
const routeViews: string = "router_views/date-of-birth";

router.get("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthHandler = new SoleTraderDateOfBirthHandler();
    const viewData = await dateOfBirthHandler.execute(req, res, next);
    res.render(`${routeViews}/capture-date-of-birth`, viewData);
});

router.post("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthHandler = new SoleTraderDateOfBirthHandler();
    const viewData = await dateOfBirthHandler.execute(req, res, next).then(() => {
        res.status(200);
        // This value needs updating when the next page is created
        res.redirect("/sole-trader/nationality");
    }).catch(e => {
        res.status(400).render(`${routeViews}/capture-date-of-birth`, e);
    });
});

export default router;
