import { NextFunction, Request, Response } from "express";
import { AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_SELECT_AML_SUPERVISOR, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { NEW_AML_BODIES, NEW_AML_BODY, REQ_TYPE_UPDATE_ACSP } from "../../../common/__utils/constants";
import { formatValidationError, resolveErrorMessage, getPageProperties } from "../../../validation/validation";
import { validationResult } from "express-validator";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER;
        const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
        const reqType = REQ_TYPE_UPDATE_ACSP;

        res.render(config.AML_MEMBERSHIP_NUMBER, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_SELECT_AML_SUPERVISOR, lang),
            currentUrl,
            amlSupervisoryBodies: [newAMLBody],
            AMLSupervisoryBodies,
            reqType,
            cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER;
        const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
        const newAMLBodies: AmlSupervisoryBody[] = session.getExtraData(NEW_AML_BODIES) || [];
        const reqType = REQ_TYPE_UPDATE_ACSP;

        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const amlSupervisoryBodyString = newAMLBody.amlSupervisoryBody!;
            errorListDisplay(errorList.array(), amlSupervisoryBodyString, lang);
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_SELECT_AML_SUPERVISOR, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                amlSupervisoryBodies: [newAMLBody],
                payload: req.body,
                AMLSupervisoryBodies,
                reqType,
                cancelLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
            });
        } else {

            newAMLBody.membershipId = req.body.membershipNumber_1;
            newAMLBodies.push(newAMLBody);

            session.setExtraData(NEW_AML_BODIES, newAMLBodies);
            session.deleteExtraData(NEW_AML_BODY);

            const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
            res.redirect(nextPageUrl);

        }
    } catch (err) {
        next(err);
    }
};

const errorListDisplay = (errors: any[], amlSupervisoryBody: string, lang: string) => {
    return errors.map((element) => {
        const selectionValue = AMLSupervisoryBodies[amlSupervisoryBody as keyof typeof AMLSupervisoryBodies];
        element.msg = resolveErrorMessage(element.msg, lang);
        element.msg = element.msg + selectionValue;
        return element;
    });
};
