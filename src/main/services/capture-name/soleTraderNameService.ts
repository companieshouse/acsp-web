import { NextFunction, Request, Response } from "express";
import logger from "../../../../lib/Logger";
import { NameValidator } from "../../../../lib/validation/name";
import { GenericService } from "../generic";

export class SoleTraderNameService extends GenericService {
    validator: NameValidator;

    constructor () {
        super();
        this.viewData.title = "What is your name?";
        this.validator = new NameValidator();
        this.viewData.previousPage = "";
    }

    async execute (req: Request, res: Response, next: NextFunction): Promise<any> {
        logger.info(`${req.method} request for sole trader name route`);
        try {
            if (req.method !== "POST") {
                return Promise.resolve(this.viewData);
            }
            this.viewData.payload = req.body;
            await this.validator.validateInputData(req.body);
            // Save the data here
        } catch (err: any) {
            // Handle exceptions specific to capture-name route
            logger.error("Error(s) inputing name");
            this.viewData.errors = this.processServiceException(err);
            return Promise.reject(this.viewData);
        }
    }

}
