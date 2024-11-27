// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import routes from "./routes";
import { BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "./types/pageURL";
import { ErrorService } from "./services/errorService";
import updateRoutes from "./routes/updateAcsp";
import { isActiveFeature } from "./utils/feature.flag";
import { FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS } from "./utils/properties";

const routerDispatch = (app: Application) => {
    app.use(BASE_URL, routes);
    if (isActiveFeature(FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS)) {
        app.use(UPDATE_ACSP_DETAILS_BASE_URL, updateRoutes);
    }
    app.use("*", (req: Request, res: Response) => {
        const errorService = new ErrorService();
        errorService.render404Page(req, res);
    });
};

export default routerDispatch;
