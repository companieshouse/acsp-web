import { NextFunction, Request, Response } from "express";
import logger from "../../../lib/Logger";
import { DateOfBirthValidator } from "../../../lib/validation/form-validators/sole-trader/date-of-birth";
import { GenericHandler } from "../generic";

export class SoleTraderCaptureDOBHandler extends GenericHandler {

    validator: DateOfBirthValidator;

    constructor () {
        super();
        this.validator = new DateOfBirthValidator();
        this.viewData.title =
            "What is your date of birth?";
    }

    async execute (req: Request, res: Response, next: NextFunction): Promise<any> {
        logger.info(`${req.method} request for date-of-birth route`);
        try {
            if (req.method !== "POST") {
                return this.viewData;
            }
            this.viewData.payload = req.body;
            await this.validator.validateInputData(req.body);
            // Save the data here
        } catch (err: any) {
            // Handle exceptions specific to capture-date-of-birth route
            logger.error(`error inputing date of birth: ${err}`);
            this.viewData.errors = this.processHandlerException(err);
        }
        return this.viewData;
    }
}
