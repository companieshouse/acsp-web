import { NextFunction, Request, Response } from "express";
import logger from "../../../lib/Logger";
import { CorrespondanceAddressManualValidator } from "../../../lib/validation/correspondanceAddressManual";
import { GenericHandler } from "../generic";

export class SoleTraderCorrespondanceAddressManualHandler extends GenericHandler {

    validator: CorrespondanceAddressManualValidator;

    constructor () {
        super();
        this.validator = new CorrespondanceAddressManualValidator();
        this.viewData.title =
            "What is your correspondance address?";
        this.viewData.previousPage = "/sole-trader/address-correspondance-lookup";
    }

    async execute (req: Request, res: Response, next: NextFunction): Promise<any> {
        logger.info(`${req.method} request for correspondance-address-manual route`);
        try {
            if (req.method !== "POST") {
                return Promise.resolve(this.viewData);
            }
            this.viewData.payload = req.body;
            await this.validator.validateInputData(req.body);
            // Save the data here
        } catch (err: any) {
            // Handle exceptions specific to capture-date-of-birth route
            logger.error("Error inputing correspondance address manual");
            this.viewData.errors = this.processHandlerException(err);
            return Promise.reject(this.viewData);
        }
    }
}
