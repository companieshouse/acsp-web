// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import dateOfBirthRouter from "./routers/soleTraderDateOfBirthRouter";
import nameRouter from "./routers/soleTraderNameRouter";
import stopNotRelevantOfficerRouter from "./routers/stopNotRelevantOfficerRouter";
import statementRelevantOfficerRouter from "./routers/statementRelevantOfficerRouter";
import setorYouWorkIn from "./routers/setorYouWorkInRouter";
import startPageRouter from "./routers/startPageRouter";

const routerDispatch = (app: Application) => {
    const soleTraderRoute : string = "/sole-trader";
    app.use(startPageRouter);
    app.use("/", stopNotRelevantOfficerRouter);
    app.use(soleTraderRoute, nameRouter);
    app.use(soleTraderRoute, dateOfBirthRouter);
    app.use("/", statementRelevantOfficerRouter);
    app.use(setorYouWorkIn);
    app.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
