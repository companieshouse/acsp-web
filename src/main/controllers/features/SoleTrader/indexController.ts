import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { ACSPServiceClient } from "../../../client/acspServiceClient";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../../../lib/Logger";
import { IndexService } from "../../../services/indexService";
import { getAccessToken } from "../../../common/__utils/session";

import {
    SUBMISSION_ID,
    TRANSACTION_CREATE_ERROR
} from "../../../common/__utils/constants";

// const acspServiceClient : ACSPServiceClient = new ACSPServiceClient("http://localhost:18644/acsp-api");

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as any as Session;
    getAccessToken(session);

    const handler = new IndexService();
    try {
        await handler.createTransaction(session, "");
        // .then((transactionId) => {
        //     // get transaction record data
        //     req.session?.setExtraData(SUBMISSION_ID, transactionId);
        // });
    } catch (err) {
        res.status(500).send("Internal Server Error");
        logger.error(TRANSACTION_CREATE_ERROR);
    };
    res.render(config.HOME, { title: "Apply to register as a Companies House authorised agent" });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.HOME, { title: "Apply to register as a Companies House authorised agent" });
};
