import express, { NextFunction, Request, Response } from "express";
import * as nunjucks from "nunjucks";
import path from "path";
import logger from "../../lib/Logger";
import routerDispatch from "./router.dispatch";
import cookieParser from "cookie-parser";
import { pageNotFound } from "./utils/error";
import { authenticationMiddleware } from "./middleware/authentication_middleware";
import { sessionMiddleware } from "./middleware/session_middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common_variables_middleware";

import {
    APPLICATION_NAME,
    CDN_URL_CSS,
    CDN_URL_JS,
    CDN_HOST,
    CHS_URL
} from "./utils/properties";
import { BASE_URL, HEALTHCHECK, ACCESSIBILITY_STATEMENT } from "./types/pageURL";
const app = express();

const nunjucksEnv = nunjucks.configure([path.join(__dirname, "views"),
    path.join(__dirname, "/../../../node_modules/govuk-frontend"),
    path.join(__dirname, "../../node_modules/govuk-frontend"),
    path.join(__dirname, "../../../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "../../node_modules/@companieshouse/ch-node-utils/templates")], {
    autoescape: true,
    express: app
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");
nunjucksEnv.addGlobal("cdnUrlCss", CDN_URL_CSS);
nunjucksEnv.addGlobal("cdnUrlJs", CDN_URL_JS);
nunjucksEnv.addGlobal("cdnHost", CDN_HOST);
nunjucksEnv.addGlobal("chsUrl", CHS_URL);
nunjucksEnv.addGlobal("SERVICE_NAME", APPLICATION_NAME);

app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files
app.use(express.static(path.join(__dirname, "/../../../assets/public")));

// Unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    res.render("partials/error_500");
});

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

// Apply middleware
app.use(cookieParser());
app.use(`^(?!(${BASE_URL}${HEALTHCHECK}|${BASE_URL}$|${BASE_URL}${ACCESSIBILITY_STATEMENT}))*`, sessionMiddleware);
app.use(`^(?!(${BASE_URL}${HEALTHCHECK}|${BASE_URL}$|${BASE_URL}${ACCESSIBILITY_STATEMENT}))*`, authenticationMiddleware);

app.use(commonTemplateVariablesMiddleware)

// Company Auth redirect
// const companyAuthRegex = new RegExp(`^${HOME_URL}/.+`);
// app.use(companyAuthRegex, companyAuthenticationMiddleware);

// Channel all requests through router dispatch
routerDispatch(app);

app.use(pageNotFound);

export default app;
