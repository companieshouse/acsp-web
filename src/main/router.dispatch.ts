// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import routes from "./routes";
import { BASE_URL } from "./types/pageURL";
import * as config from "./config";

const routerDispatch = (app: Application) => {
    app.use(BASE_URL, routes);
    app.use("*", (req: Request, res: Response) => {
        res.status(400).render(config.ERROR_400);
    });
};

export default routerDispatch;
