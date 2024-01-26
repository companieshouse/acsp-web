import { NextFunction, Request, Response, Router } from "express";
import { SoleTraderDateOfBirthService } from "../../../services/capture-date-of-birth/soleTraderDateOfBirthServcie";
import { SOLE_TRADER_DOB } from "../../../config";

const soleTraderDateOfBirthController = Router();

soleTraderDateOfBirthController.get("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthService = new SoleTraderDateOfBirthService();
    const viewData = await dateOfBirthService.execute(req, res, next);
    res.render(SOLE_TRADER_DOB, viewData);
});

soleTraderDateOfBirthController.post("/date-of-birth", async (req: Request, res: Response, next: NextFunction) => {
    const dateOfBirthService = new SoleTraderDateOfBirthService();
    const viewData = await dateOfBirthService.execute(req, res, next).then(() => {
        res.status(200);
        // This value needs updating when the next page is created
        res.redirect("/sole-trader/nationality");
    }).catch(e => {
        res.status(400).render(SOLE_TRADER_DOB, e);
    });
});

export default soleTraderDateOfBirthController;
