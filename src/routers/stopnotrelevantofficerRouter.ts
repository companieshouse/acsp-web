import { Request, Response, Router, NextFunction } from "express";
import { StopNotRelevantOfficerHandler } from "./handlers/kick-out/stop-not-relevant-officer";

const router: Router = Router();
const routeViews: string = "router_views/kick-out";

router.get("/stop-not-relevant-officer", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new StopNotRelevantOfficerHandler();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/stop-not-relevant-officer`, viewData);
});

export default router;
