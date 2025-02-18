import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_ACSP_DETAILS_BASE_URL, AML_MEMBERSHIP_NUMBER, UPDATE_YOUR_ANSWERS, UPDATE_ADD_AML_SUPERVISOR } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { NEW_AML_BODIES, NEW_AML_BODY, ADD_AML_BODY_UPDATE } from "../../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const newAMLBodies: AmlSupervisoryBody[] = session.getExtraData(NEW_AML_BODIES) || [];
        const update: number | undefined = req.query.update as number | undefined;

        let amlBody = "";
        if (update) {
            amlBody = newAMLBodies[update].amlSupervisoryBody!;
            session.setExtraData(ADD_AML_BODY_UPDATE, update);
        }

        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR;

        res.render(config.UPDATE_ADD_AML_SUPERVISORY_BODY, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            AMLSupervisoryBodies,
            amlBody
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR;
        const session: Session = req.session as any as Session;
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                AMLSupervisoryBodies,
                ...pageProperties
            });
        } else {
            // Save new AML body into session
            session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: req.body["AML-supervisory-bodies"] });

            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (err) {
        next(err);
    }
};
