import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";
import { StopNotRelevantOfficerHandler } from "./handlers/index/stop-not-relevant-officer";

const router: Router = Router();
const routeViews: string = "router_views/index";

// Home route
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new HomeHandler();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/home`, viewData);
});

// Stop Not Relevant Officer route
router.get("/stop-not-relevant-officer", async (req: Request, res: Response, next: NextFunction) => {
    const stopNotRelevantHandler = new StopNotRelevantOfficerHandler();
    const stopNotRelevantViewData = await stopNotRelevantHandler.execute(req, res);
    res.render(`${routeViews}/stop-not-relevant-officer`, stopNotRelevantViewData);
});

export default router;
