import { Request, Response, Router, NextFunction } from "express";
import { StopNotRelevantOfficerService } from "../../../services/kick-out/stopNotRelevantOfficerService";
import { SOLE_TRADER_KICK_OUT } from "../../../config";

const stopNotRelevantOfficerController = Router();

stopNotRelevantOfficerController.get("/stop-not-relevant-officer", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new StopNotRelevantOfficerService();
    const viewData = await handler.execute(req, res);
    res.render(SOLE_TRADER_KICK_OUT, viewData);
});

export default stopNotRelevantOfficerController;
