import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderCorrespondanceAddressManualHandler } from "./handlers/capture-correspondance-address-manual/soleTraderCorrespondanceAddressManual";

const router: Router = Router();
const routeViews: string = "router_views/correspondance-address-manual";

router.get("/address-correspondance-manual", async (req: Request, res: Response, next: NextFunction) => {
    const correspondanceAddressManualHandler = new SoleTraderCorrespondanceAddressManualHandler();
    const viewData = await correspondanceAddressManualHandler.execute(req, res, next);
    res.render(`${routeViews}/capture-correspondance-address-manual`, viewData);
});

router.post("/address-correspondance-manual", async (req: Request, res: Response, next: NextFunction) => {
    const correspondanceAddressManualHandler = new SoleTraderCorrespondanceAddressManualHandler();
    const viewData = await correspondanceAddressManualHandler.execute(req, res, next).then(() => {
        res.status(200);
        res.redirect("/sole-trader/address-correspondance-confirm");
    }).catch(e => {
        res.status(400).render(`${routeViews}/capture-correspondance-address-manual`, e);
    });
});

export default router;
