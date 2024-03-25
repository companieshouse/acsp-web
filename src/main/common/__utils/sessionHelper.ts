import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import logger from "../../../../lib/Logger";

export const saveDataInSession = async (req: Request, name: string, value: any) => {
    logger.info("Data saved in session");
    const session: Session = req.session as any as Session;
    session.setExtraData(name, value);
    logger.info("Data saved in session--------" + session.getExtraData(name));
    logger.info("Data saved in session--------" + getSessionValue(req, name));
};

export const getSessionValue = async (req: Request, name: string) => {
    const session: Session = req.session as any as Session;
    session.getExtraData(name);
};
