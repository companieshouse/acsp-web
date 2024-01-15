import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderCaptureDOBHandler } from "./handlers/sole-trader/capture-dob";

const router: Router = Router();
const routeViews: string = "router_views/sole-trader";

router.get("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthHandler = new SoleTraderCaptureDOBHandler();
    const viewData = await dateOfBirthHandler.execute(req, res, next);
    res.render(`${routeViews}/capture-date-of-birth`, viewData);
});

router.post("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthHandler = new SoleTraderCaptureDOBHandler();
    const viewData = await dateOfBirthHandler.execute(req, res, next).then(() => {
        res.status(200);
        // This value needs updating when the next page is created
        res.redirect("/sole-trader/nationality");
    }).catch(e => {
        res.status(400).render(`${routeViews}/capture-date-of-birth`, e);
    });
});

export default router;
