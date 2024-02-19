import { Router } from "express";
import {
    indexController, soleTraderDateOfBirthController, soleTraderNameController,
    statementRelevantOfficerController, stopNotRelevantOfficerController, sectorYouWorkInController,
    soleTraderCorrespondanceAddressManualController, soleTraderWhereDoYouLiveController,
    soleTraderNationalityController, typeOfBusinessController, healthCheckController
} from "../controllers";
import { correspondanceAddressManualValidator } from "../../../lib/validation/correspondanceAddressManual";
import { whereDoYouLiveValidator } from "../../../lib/validation/whereDoYouLive";
import { dateOfBirthValidator } from "../../../lib/validation/dateOfBirth";
import { nameValidator } from "../../../lib/validation/name";
import { sectorYouWorkInValidator } from "../validation/sectorYouWorkIn";
import { nationalityValidator } from "../../main/validation/nationality";
import { typeOfBusinessValidator } from "../validation/typeOfBusiness";
import * as urls from "../types/pageURL";

const routes = Router();

routes.get(urls.START, indexController.get);
routes.post(urls.START, indexController.post);

routes.get(urls.SOLE_TRADER_DATE_OF_BIRTH, soleTraderDateOfBirthController.get);
routes.post(urls.SOLE_TRADER_DATE_OF_BIRTH, dateOfBirthValidator, soleTraderDateOfBirthController.post);

routes.get("/sole-trader/name", soleTraderNameController.get);
routes.post("/sole-trader/name", nameValidator, soleTraderNameController.post);

routes.get("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.get);
routes.post("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.post);

routes.get("/sole-trader/stop-not-relevant-officer", stopNotRelevantOfficerController.get);

routes.get(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, sectorYouWorkInController.get);
routes.post(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, sectorYouWorkInValidator, sectorYouWorkInController.post);

routes.get("/sole-trader/where-do-you-live", soleTraderWhereDoYouLiveController.get);
routes.post("/sole-trader/where-do-you-live", whereDoYouLiveValidator, soleTraderWhereDoYouLiveController.post);

routes.get("/sole-trader/correspondance-address-manual", soleTraderCorrespondanceAddressManualController.get);
routes.post("/sole-trader/correspondance-address-manual", correspondanceAddressManualValidator, soleTraderCorrespondanceAddressManualController.post);

routes.get("/sole-trader/nationality", soleTraderNationalityController.get);
routes.post("/sole-trader/nationality", nationalityValidator, soleTraderNationalityController.post);

routes.get(urls.SOLE_TRADER_TYPE_OF_BUSINESS, typeOfBusinessController.get);
routes.post(urls.SOLE_TRADER_TYPE_OF_BUSINESS, typeOfBusinessValidator, typeOfBusinessController.post);

routes.get(urls.HEALTHCHECK, healthCheckController.get);

export default routes;
