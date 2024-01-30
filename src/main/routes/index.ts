import { Router } from "express";
import { indexController, soleTraderDateOfBirthController, soleTraderNameController, statementRelevantOfficerController, stopNotRelevantOfficerController } from "../controllers";

const routes = Router();

routes.get("/", indexController.get);

routes.get("/sole-trader/date-of-birth", soleTraderDateOfBirthController.get);
routes.post("/sole-trader/date-of-birth", soleTraderDateOfBirthController.post);

routes.get("/sole-trader/name", soleTraderNameController.get);
routes.post("/sole-trader/name", soleTraderNameController.post);

routes.get("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.get);
routes.post("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.post);

routes.get("/stop-not-relevant-officer", stopNotRelevantOfficerController.get);

export default routes;
