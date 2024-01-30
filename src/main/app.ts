import express, { Request, Response, NextFunction } from "express";

import nunjucks from "nunjucks";
import path from "path";
import logger from "../../lib/Logger";
import routerDispatch from "./router.dispatch";

const app = express();

const nunjucksEnv = nunjucks.configure([path.join(__dirname, "views"),
    path.join(__dirname, "/../../../node_modules/govuk-frontend"),
    path.join(__dirname, "/../../node_modules/govuk-frontend")], {
    autoescape: true,
    express: app
});

nunjucksEnv.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
nunjucksEnv.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
nunjucksEnv.addGlobal("cdnHost", process.env.CDN_HOST);
nunjucksEnv.addGlobal("chsUrl", process.env.CHS_URL);

app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log("dirname-------------->", __dirname);
app.set("views", path.join(__dirname, "views"));
console.log("views 1--------------->", app.get("views"));
app.set("view engine", "njk");

console.log("views 2--------------->", app.get("views"));

console.log("assets--->", path.join(__dirname, "/../../../assets/public"));
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

export default app;
