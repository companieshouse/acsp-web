import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderNameHandler } from "./handlers/capture-name/soleTraderName";

const router: Router = Router();
const routeViews: string = "router_views/name";

router.get("/name", async (req: Request, res: Response, next: NextFunction) => {
    const nameHandler = new SoleTraderNameHandler();
    const viewData = await nameHandler.execute(req, res, next);
    res.render(`${routeViews}/capture-name`, viewData);
});

router.post("/name", async (req: Request, res: Response, next: NextFunction) => {
    const nameHandler = new SoleTraderNameHandler();
    const viewData = await nameHandler.execute(req, res, next).then(() => {
        return res.redirect("/sole-trader/date-of-birth");
    }).catch(viewData => {
        res.status(400).render(`${routeViews}/capture-name`, viewData);
    });
});

export default router;
