import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_AML_INTERRUPT, SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, SOLE_TRADER_TYPE_OF_BUSINESS, LIMITED_AML_REGISTRATION } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.LIMITED_AML_INTERRUPT, {
        previousPage: addLangToUrl(SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, lang),
        soleTrader: addLangToUrl(SOLE_TRADER_TYPE_OF_BUSINESS, lang),
        amlReg: addLangToUrl(LIMITED_AML_REGISTRATION, lang),
        title: "aml interrupt",
        ...getLocaleInfo(locales, lang),
        currentUrl: LIMITED_AML_INTERRUPT
    });
};
