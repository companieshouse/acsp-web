import { Request, Response } from "express";
import { StopNotRelevantOfficerService } from "../../../services/kick-out/stopNotRelevantOfficerService";
import { SOLE_TRADER_KICK_OUT } from "../../../config";

export const get = async (req: Request, res: Response) => {
    const handler = new StopNotRelevantOfficerService();
    const viewData = await handler.execute(req, res);
    res.render(SOLE_TRADER_KICK_OUT, viewData);
};
