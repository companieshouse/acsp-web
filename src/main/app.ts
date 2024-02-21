import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import * as nunjucks from "nunjucks";
import path from "path";
import logger from "../../lib/Logger";
import routerDispatch from "./router.dispatch";
import cookieParser from "cookie-parser";
import {
    SessionStore,
    SessionMiddleware,
    Session
} from "@companieshouse/node-session-handler";

import { authenticationMiddleware } from "./middleware/authentication_middleware";
import { sessionMiddleware } from "./middleware/session_middleware";

import Redis from "ioredis";
import { COMPANY_BASE_URL, EMAIL_BASE_URL, HOME_URL, SIGN_OUT_URL } from "./config";
import { companyAuthenticationMiddleware } from "./middleware/company_authentication_middleware";

const app = express();

const nunjucksEnv = nunjucks.configure([path.join(__dirname, "views"),
    path.join(__dirname, "/../../../node_modules/govuk-frontend"),
    path.join(__dirname, "../../node_modules/govuk-frontend"),
    path.join(__dirname, "../../../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "../../node_modules/@companieshouse/ch-node-utils/templates")], {
    autoescape: true,
    express: app
});

nunjucksEnv.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
nunjucksEnv.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
nunjucksEnv.addGlobal("cdnHost", process.env.CDN_HOST);
nunjucksEnv.addGlobal("chsUrl", process.env.CHS_URL);

app.enable("trust proxy");

declare module "express-session" {
    export interface SessionData {
      user: { [key: string]: any };
    }
  }
app.use(session({
    secret: "123456",
    resave: false,
    saveUninitialized: true
}));

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");
// Serve static files
app.use(express.static(path.join(__dirname, "/../../../assets/public")));
// app.use("/assets", express.static("./../node_modules/govuk-frontend/govuk/assets"));

// Unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    res.render("partials/error_500");
});

// Channel all requests through router dispatch
routerDispatch(app);

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
app.use(`${HOME_URL}*`, sessionMiddleware);
app.use(`${HOME_URL}*`, authenticationMiddleware);

const companyAuthRegex = new RegExp(`^${HOME_URL}/.+`);
app.use(companyAuthRegex, companyAuthenticationMiddleware);

export default app;
