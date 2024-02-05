import { Router } from "express";
import {
    indexController, soleTraderDateOfBirthController, soleTraderNameController,
    statementRelevantOfficerController, stopNotRelevantOfficerController, sectorYouWorkInController,
    soleTraderCorrespondanceAddressManualController, soleTraderWhereDoYouLiveController, soleTraderCorrespondenceAddressAutoLookupController, soleTraderCorrespodanceAddressDetailsController
} from "../controllers";
import { correspondanceAddressManualValidator } from "../../../lib/validation/correspondanceAddressManual";
import { whereDoYouLiveValidator } from "../../../lib/validation/whereDoYouLive";
import { dateOfBirthValidator } from "../../../lib/validation/dateOfBirth";
import { nameValidator } from "../../../lib/validation/name";
import { sectorYouWorkInValidator } from "../../../lib/validation/sectorYouWorkIn";
import { correspondenceAddressAutoLookupValidator } from "../../../lib/validation/correspondenceAddressAutoLookup";
import { correspondenceAddressListValidator } from "../../../lib/validation/correspondanceAddressList";

const routes = Router();

routes.get("/", indexController.get);

routes.get("/sole-trader/date-of-birth", soleTraderDateOfBirthController.get);
routes.post("/sole-trader/date-of-birth", dateOfBirthValidator, soleTraderDateOfBirthController.post);

routes.get("/sole-trader/name", soleTraderNameController.get);
routes.post("/sole-trader/name", nameValidator, soleTraderNameController.post);

routes.get("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.get);
routes.post("/sole-trader/statement-relevant-officer", statementRelevantOfficerController.post);

routes.get("/sole-trader/stop-not-relevant-officer", stopNotRelevantOfficerController.get);

routes.get("/sole-trader/sector-you-work-in", sectorYouWorkInController.get);
routes.post("/sole-trader/sector-you-work-in", sectorYouWorkInValidator, sectorYouWorkInController.post);

routes.get("/sole-trader/where-do-you-live", soleTraderWhereDoYouLiveController.get);
routes.post("/sole-trader/where-do-you-live", whereDoYouLiveValidator, soleTraderWhereDoYouLiveController.post);

routes.get("/sole-trader/correspondance-address-manual", soleTraderCorrespondanceAddressManualController.get);
routes.post("/sole-trader/correspondance-address-manual", correspondanceAddressManualValidator, soleTraderCorrespondanceAddressManualController.post);

routes.get("/sole-trader/correspondenceAddressAutoLookup", soleTraderCorrespondenceAddressAutoLookupController.get);
routes.post("/sole-trader/correspondenceAddressAutoLookup", correspondenceAddressAutoLookupValidator, soleTraderCorrespondenceAddressAutoLookupController.post);

routes.get("/sole-trader/correspondence-address-list", soleTraderCorrespodanceAddressDetailsController.get);
routes.post("/sole-trader/correspondence-address-list", correspondenceAddressListValidator, soleTraderCorrespodanceAddressDetailsController.post);
export default routes;
