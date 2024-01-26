import { Request, Response } from "express";
import logger from "../../../lib/Logger";
import { GenericHandler } from "./../generic";

export class StartPageHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData.title = "Apply to register as a Companies House authorised agent";
        this.viewData.title = "";
    }

    async execute (req: Request, response: Response): Promise<Object> {
        try {
            logger.info(`GET request for start-page route`);
            // ...process request specific to start-page route and update viewData
            return Promise.resolve(this.viewData);
        } catch (err) {
            // Handle exceptions specific to start-page route
            const errorData = this.processHandlerException(err);
            return Promise.reject(errorData);
        }
    }

}