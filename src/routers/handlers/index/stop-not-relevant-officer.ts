import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import logger from "../../../lib/Logger";

export class StopNotRelevantOfficerHandler extends GenericHandler {

    constructor() {
        super();
        this.viewData.title = "Stop Not Relevant Officer handler for index router";
        this.viewData.sampleKey = "sample value for stop-not-relevant-officer page screen";
    }

    async execute(req: Request, response: Response): Promise<Object> {
        try {
            logger.info(`GET request for stop-not-relevant-officer route`);

            // ...process request specific to stop-not-relevant-officer route and update viewData

            return Promise.resolve(this.viewData);
        } catch (err) {
            // Handle exceptions specific to stop-not-relevant-officer route
            const errorData = this.processHandlerException(err);
            return Promise.reject(errorData);
        }
    }

    // Additional methods specific to stop-not-relevant-officer route can be added here
    private stopNotRelevantOfficerMethod(): boolean {
        return true;
    }
}


