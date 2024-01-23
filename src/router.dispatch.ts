// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import indexRouter from "./routers/indexRouter";
import dateOfBirthRouter from "./routers/soleTraderDateOfBirthRouter";
import setorYouWorkIn from "./routers/setorYouWorkInRouter";

const routerDispatch = (app: Application) => {
    const soleTraderRoute : string = "/sole-trader";
    app.use("/", indexRouter);
    app.use(soleTraderRoute, dateOfBirthRouter);
    app.use(setorYouWorkIn);
    app.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
