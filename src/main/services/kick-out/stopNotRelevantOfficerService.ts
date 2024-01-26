import { Request, Response } from "express";
import logger from "../../../../lib/Logger";
import { GenericService } from "./../generic";

export class StopNotRelevantOfficerService extends GenericService {

    constructor () {
        super();
        this.viewData.title = "You cannot use this service";
        this.viewData.title = "";
    }

    async execute (req: Request, response: Response): Promise<Object> {
        try {
            logger.info(`GET request for stop-not-relevant-officer route`);
            // ...process request specific to stop-not-relevant-officer route and update viewData
            return Promise.resolve(this.viewData);
        } catch (err) {
            // Handle exceptions specific to stop-not-relevant-officer route
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }

}
