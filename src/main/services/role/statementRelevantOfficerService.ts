import { Request, Response } from "express";
import logger from "../../../../lib/Logger";
import { GenericService } from "./../generic";

export class StatementRelevantOfficerService extends GenericService {

    constructor () {
        super();
        this.viewData.title = "What is your role?";
        this.viewData.title = "";

    }

    async execute (req: Request, response: Response): Promise<Object> {
        try {
            logger.info(`GET request for statement-relevant-officer route`);
            // ...process request specific to statement-relevant-officer route
            return Promise.resolve(this.viewData);
        } catch (err) {
            // Handle exceptions specific to stop-not-relevant-officer route
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }
}

export default StatementRelevantOfficerService;
