import { NextFunction, Request, Response, Router } from "express";
import { StartPageHandler } from "./handlers/start-page/startPage";

const router: Router = Router();
const routeViews: string = "router_views/start-page";

router.get("/start-page", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new StartPageHandler();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/start-page`, viewData);
});

export default router;
