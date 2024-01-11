import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderCaptureDOBHandler } from "./handlers/sole-trader/capture-dob";

const router: Router = Router();
const routeViews: string = "router_views/sole-trader";

router.get("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthHandler = new SoleTraderCaptureDOBHandler();
    const viewData = await dateOfBirthHandler.execute(req, res);
    res.render(`${routeViews}/capture-date-of-birth`, viewData);
});

export default router;
