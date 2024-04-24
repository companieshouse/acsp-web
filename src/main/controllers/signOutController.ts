import { NextFunction, Request, Response } from "express";
import logger, { createAndLogErrorRequest } from "../../../lib/Logger";
import * as config from "../config";
import { isActiveFeature } from "../utils/feature.flag";
import { getPreviousPageUrl } from "../services/url";
import { BASE_URL, SIGN_OUT_URL } from "../types/pageURL";

export const get = (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debugRequest(req, `GET ${config.SIGN_OUT_PAGE}`);

        const previousPageUrl = getPreviousPageUrl(req, BASE_URL);

        return res.render(config.SIGN_OUT_PAGE, {
            previousPage: previousPageUrl,
            saveAndResume: isActiveFeature(config.FEATURE_FLAG_ENABLE_SAVE_AND_RESUME_17102022),
            journey: config.JourneyType.register
        });
    } catch (error) {
        logger.errorRequest(req, error);
        next(error);
    }
};

export const post = (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debugRequest(req, `POST ${config.SIGN_OUT_PAGE}`);
        const previousPage = req.body.previousPage;

        if (!previousPage.startsWith(BASE_URL)) {
            throw createAndLogErrorRequest(req, `${previousPage} page is not part of the journey!`);
        }

        if (req.body.sign_out === "yes") {
            return res.redirect(SIGN_OUT_URL);
        }

        return (previousPage);
    } catch (error) {
        logger.errorRequest(req, error);
        next(error);
    }
};
