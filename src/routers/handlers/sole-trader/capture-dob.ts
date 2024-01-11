import { Request, Response } from "express";
import logger from "../../../lib/Logger";
import { GenericHandler } from "../generic";

export class SoleTraderCaptureDOBHandler extends GenericHandler {
    constructor () {
        super();
        this.viewData.title =
            "Sole Trader Capture Date of Birth for index router";
        this.viewData.sampleKey =
            "sample value for date-of-birth screen";
    }

    async execute (req: Request, res: Response): Promise<Object> {
        try {
            logger.info(`GET request for date-of-birth route`);
            return Promise.resolve(this.viewData);
        } catch (error) {
            // Handle exceptions specific to capture-date-of-birth route
            const errorData = this.processHandlerException(error);
            return Promise.reject(errorData);
        }
    }
}
