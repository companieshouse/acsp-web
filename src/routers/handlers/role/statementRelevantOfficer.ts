import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import logger from "../../../lib/Logger";

export class StatementRelevantOfficerHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData.title = "What is your role?";

    }

    async execute (req: Request, response: Response): Promise<Object> {
        try {
            logger.info(`GET request for statement-relevant-officer route`);
            // ...process request specific to statement-relevant-officer route
            return Promise.resolve(this.viewData);
        } catch (err) {
            // Handle exceptions specific to stop-not-relevant-officer route
            const errorData = this.processHandlerException(err);
            return Promise.reject(errorData);
        }
    }
}

export default StatementRelevantOfficerHandler;
