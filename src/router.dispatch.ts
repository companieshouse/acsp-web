// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import indexRouter from "./routers/indexRouter";
import sectorYouWorkIn from "./routers/sectorYouWorkInRouter";
import dateOfBirthRouter from "./routers/soleTraderDateOfBirthRouter";
import correspondanceAddressManualRouter from "./routers/soleTraderCorrespondanceAddressManualRouter";
import nameRouter from "./routers/soleTraderNameRouter";
import whereDoYouLiveRouter from "./routers/soleTraderWhereDoYouLiveRouter";
import statementRelevantOfficerRouter from "./routers/statementRelevantOfficerRouter";
import stopNotRelevantOfficerRouter from "./routers/stopNotRelevantOfficerRouter";

const routerDispatch = (app: Application) => {
    const soleTraderRoute : string = "/sole-trader";
    app.use("/", indexRouter);
    app.use("/", stopNotRelevantOfficerRouter);
    app.use(soleTraderRoute, nameRouter);
    app.use(soleTraderRoute, dateOfBirthRouter);
    app.use(soleTraderRoute, whereDoYouLiveRouter);
    app.use(soleTraderRoute, correspondanceAddressManualRouter);
    app.use("/", statementRelevantOfficerRouter);
    app.use(sectorYouWorkIn);
    app.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
