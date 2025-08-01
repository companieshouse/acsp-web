import express, { NextFunction, Request, Response } from "express";
import * as nunjucks from "nunjucks";
import path from "path";
import logger from "./utils/logger";
import routerDispatch from "./router.dispatch";
import cookieParser from "cookie-parser";
import { authenticationMiddleware } from "./middleware/authentication_middleware";
import { authenticationMiddlewareForSoleTrader } from "./middleware/authentication_middleware_sole_trader";
import { sessionMiddleware } from "./middleware/session_middleware";
import {
    APPLICATION_NAME,
    CDN_URL_CSS,
    CDN_URL_JS,
    ANY_PROTOCOL_CDN_HOST,
    CHS_URL,
    PIWIK_URL,
    PIWIK_SITE_ID,
    CHS_MONITOR_GUI_URL,
    FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY
} from "./utils/properties";
import { BASE_URL, SOLE_TRADER, HEALTHCHECK, ACCESSIBILITY_STATEMENT, UPDATE_ACSP_DETAILS_BASE_URL, TYPE_OF_BUSINESS, SIGN_OUT_URL, CLOSE_ACSP_BASE_URL, MUST_BE_AUTHORISED_AGENT } from "./types/pageURL";
import { commonTemplateVariablesMiddleware } from "./middleware/common_variables_middleware";
import { updateAcspAuthMiddleware } from "./middleware/update-acsp/update_acsp_authentication_middleware";
import { updateAcspBaseAuthenticationMiddleware } from "./middleware/update-acsp/update_acsp_base_authentication_middleware";
import { updateAcspIsOwnerMiddleware } from "./middleware/update-acsp/update_acsp_is_owner_middleware";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import nocache from "nocache";
import { prepareCSPConfig, prepareCSPConfigHomePage } from "./middleware/content_security_policy_middleware_config";
import { csrfProtectionMiddleware } from "./middleware/csrf_protection_middleware";
import errorHandler from "./controllers/errorController";
import { registrationVariablesMiddleware } from "./middleware/registration_variables_middleware";
import { updateVariablesMiddleware } from "./middleware/update-acsp/update_variables_middleware";
import { isActiveFeature } from "./utils/feature.flag";
import { closeVariablesMiddleware } from "./middleware/close-acsp/close_variables_middleware";
import { closeAcspBaseAuthenticationMiddleware } from "./middleware/close-acsp/close_acsp_base_authentication_middleware";
import { closeAcspAuthMiddleware } from "./middleware/close-acsp/close_acsp_authentication_middleware";
import { closeAcspIsOwnerMiddleware } from "./middleware/close-acsp/close_acsp_is_owner_middleware";
import { getAcspProfileMiddleware } from "./middleware/close-acsp/close_acsp_get_acsp_profile_middleware";
import { getUpdateAcspProfileMiddleware } from "./middleware/update-acsp/update_acsp_get_acsp_profile_middleware";
import { updateAcspUserIsPartOfAcspMiddleware } from "./middleware/update-acsp/update_acsp_user_is_part_of_acsp_middleware";
import { closeAcspUserIsPartOfAcspMiddleware } from "./middleware/close-acsp/close_acsp_user_is_part_of_acsp_middleware";

const app = express();
const nonce: string = uuidv4();

const nunjucksEnv = nunjucks.configure([path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend"),
    path.join(__dirname, "/../../node_modules/govuk-frontend"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "/../../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "/../node_modules/@companieshouse"),
    path.join(__dirname, "/../../node_modules/@companieshouse")], {
    autoescape: true,
    express: app
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");
nunjucksEnv.addGlobal("cdnUrlCss", CDN_URL_CSS);
nunjucksEnv.addGlobal("cdnUrlJs", CDN_URL_JS);
nunjucksEnv.addGlobal("cdnHost", ANY_PROTOCOL_CDN_HOST);
nunjucksEnv.addGlobal("chsUrl", CHS_URL);
nunjucksEnv.addGlobal("chsMonitorGuiUrl", CHS_MONITOR_GUI_URL);
nunjucksEnv.addGlobal("SERVICE_NAME", APPLICATION_NAME);

nunjucksEnv.addGlobal("PIWIK_URL", PIWIK_URL);
nunjucksEnv.addGlobal("PIWIK_SITE_ID", PIWIK_SITE_ID);
nunjucksEnv.addGlobal("PIWIK_EMBED", PIWIK_SITE_ID);

app.enable("trust proxy");

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = nonce;
    next();
});

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files
app.use(express.static(path.join(__dirname, "/../assets/public")));

// Apply middleware
app.use(cookieParser());
app.use(nocache());

if (isActiveFeature(FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY)) {
    app.use(`^(${BASE_URL}${TYPE_OF_BUSINESS}|${BASE_URL}$|${BASE_URL}${SIGN_OUT_URL})$`, helmet(prepareCSPConfigHomePage(nonce)));
    app.use(`^(?!(${BASE_URL}${TYPE_OF_BUSINESS}$|${BASE_URL}$|${BASE_URL}${SIGN_OUT_URL}))*`, helmet(prepareCSPConfig(nonce)));
} else {
    app.use(`^(${BASE_URL}|${BASE_URL}${SIGN_OUT_URL})$`, helmet(prepareCSPConfigHomePage(nonce)));
    app.use(`^(?!(${BASE_URL}$|${BASE_URL}${SIGN_OUT_URL}))*`, helmet(prepareCSPConfig(nonce)));
}
app.use(`^(?!(${BASE_URL}${HEALTHCHECK}|${BASE_URL}$|${BASE_URL}${ACCESSIBILITY_STATEMENT}))*`, sessionMiddleware);
app.use(`^(?!(${BASE_URL}${HEALTHCHECK}|${BASE_URL}$|${BASE_URL}${ACCESSIBILITY_STATEMENT}))*`, csrfProtectionMiddleware);
app.use(`^(?!(${BASE_URL}${HEALTHCHECK}|${BASE_URL}$|${BASE_URL}${ACCESSIBILITY_STATEMENT})|(${BASE_URL}${SOLE_TRADER})|(${UPDATE_ACSP_DETAILS_BASE_URL})|(${CLOSE_ACSP_BASE_URL}))*`, authenticationMiddleware);
app.use(`^(${BASE_URL}${SOLE_TRADER})*`, authenticationMiddlewareForSoleTrader);
app.use(commonTemplateVariablesMiddleware);
app.use(BASE_URL, registrationVariablesMiddleware);

// Update ACSP details middleware
app.use(UPDATE_ACSP_DETAILS_BASE_URL, updateAcspBaseAuthenticationMiddleware);
app.use(UPDATE_ACSP_DETAILS_BASE_URL, updateAcspUserIsPartOfAcspMiddleware);
app.use(`^${UPDATE_ACSP_DETAILS_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, updateAcspAuthMiddleware);
app.use(`^${UPDATE_ACSP_DETAILS_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, getUpdateAcspProfileMiddleware);
app.use(UPDATE_ACSP_DETAILS_BASE_URL, updateVariablesMiddleware);
app.use(`^${UPDATE_ACSP_DETAILS_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, updateAcspIsOwnerMiddleware);

// Close ACSP middleware
app.use(CLOSE_ACSP_BASE_URL, closeAcspBaseAuthenticationMiddleware);
app.use(CLOSE_ACSP_BASE_URL, closeAcspUserIsPartOfAcspMiddleware);
app.use(`^${CLOSE_ACSP_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, closeAcspAuthMiddleware);
app.use(`^${CLOSE_ACSP_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, getAcspProfileMiddleware);
app.use(CLOSE_ACSP_BASE_URL, closeVariablesMiddleware);
app.use(`^${CLOSE_ACSP_BASE_URL}(?!${MUST_BE_AUTHORISED_AGENT})`, closeAcspIsOwnerMiddleware);

// Company Auth redirect
// const companyAuthRegex = new RegExp(`^${HOME_URL}/.+`);
// app.use(companyAuthRegex, companyAuthenticationMiddleware);

// Channel all requests through router dispatch
routerDispatch(app);

app.use(...errorHandler);

// Unhandled exceptions
process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
