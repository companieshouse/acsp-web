import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();
const routeViews: string = "router_views/start-page";

router.get("/start-page", async (req: Request, res: Response, next: NextFunction) => {
    res.render(`${routeViews}/start-page`, {title: "Apply to register as a Companies House authorised agent"});
});

export default router;
