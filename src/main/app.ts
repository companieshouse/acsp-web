import express, { Request, Response, NextFunction } from "express";

import nunjucks from "nunjucks";
import path from "path";
import logger from "../../lib/Logger";
import routerDispatch from "./router.dispatch";

const app = express();
// set up the template engine
/* const nunjucksLoaderOpts = {
    watch: process.env.NUNJUCKS_LOADER_WATCH !== "false",
    noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== "true"
};

const nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(app.get("views"),
      nunjucksLoaderOpts)); */

const nunjucksEnv = nunjucks.configure([
    "views",
    "views/update",
    "node_modules/govuk-frontend/",
    "node_modules/govuk-frontend/components"
], {
    autoescape: true,
    express: app
});

nunjucksEnv.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
nunjucksEnv.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
nunjucksEnv.addGlobal("cdnHost", process.env.CDN_HOST);
nunjucksEnv.addGlobal("chsUrl", process.env.CHS_URL);

// const viewPath = path.join(__dirname, "/views");

// app.set("views", [
//     path.join(__dirname, "/views"),
//     path.join(__dirname, "/../node_modules/govuk-frontend")
// ]);

// njk.express(app);
// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "/../assets/public")));
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
