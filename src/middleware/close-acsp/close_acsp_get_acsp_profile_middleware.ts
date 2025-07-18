import { NextFunction, Request, Response } from "express";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getLoggedInAcspNumber } from "../../common/__utils/session";
import { getAcspFullProfile } from "../../services/acspProfileService";
import { ACSP_DETAILS, CEASED } from "../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { AcspCeasedError } from "../../errors/acspCeasedError";

export const getAcspProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        let acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspNumber: string = getLoggedInAcspNumber(req.session);

        if (!acspDetails) {
            acspDetails = await getAcspFullProfile(acspNumber);
            session.setExtraData(ACSP_DETAILS, acspDetails);
        }

        if (acspDetails.status === CEASED) {
            throw new AcspCeasedError("ACSP is ceased. Cannot proceed with account closure.");
        }
        next();
    } catch (error) {
        next(error);
    }
};
