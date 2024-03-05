import { Router } from "express";
import {
    indexController, soleTraderDateOfBirthController, soleTraderNameController,
    statementRelevantOfficerController, stopNotRelevantOfficerController, sectorYouWorkInController,
    soleTraderCorrespondenceAddressManualController, soleTraderWhereDoYouLiveController,
    soleTraderNationalityController, typeOfBusinessController, healthCheckController, OtherTypeOfBusinessController, soleTraderCorrespondenceAddressAutoLookupController,
    soleTraderCorrespodanceAddressDetailsController, soleTraderCorrespondenceAddressConfirmController, nameRegisteredWithAmlController, businessMustbeAmlRegisteredController,
    companyLookupController, companyInactiveController, whatIsTheBusinessNameController, accessibilityStatementController, isThisYourCompanyController

} from "../controllers";

import { correspondenceAddressManualValidator } from "../validation/correspondenceAddressManual";
import { whereDoYouLiveValidator } from "../../../lib/validation/whereDoYouLive";
import { dateOfBirthValidator } from "../../../lib/validation/dateOfBirth";
import { nameValidator } from "../../../lib/validation/name";
import { correspondenceAddressAutoLookupValidator } from "../validation/correspondenceAddressAutoLookup";
import { correspondenceAddressListValidator } from "../validation/correspondanceAddressList";
import { sectorYouWorkInValidator } from "../validation/sectorYouWorkIn";
import { nationalityValidator } from "../../main/validation/nationality";
import { typeOfBusinessValidator } from "../validation/typeOfBusiness";
import { otherTypeOfBusinessValidator } from "../validation/otherTypeOfBusiness";
import * as urls from "../types/pageURL";
import { nameRegisteredWithAmlValidator } from "../validation/nameRegisteredWithAml";
import { companyNumberValidator } from "../validation/companyLookup";
import { whatIsTheBusinessNameValidator } from "../validation/whatIsTheBusinessName";

const routes = Router();

routes.get(urls.HOME_URL, indexController.get);
routes.post(urls.HOME_URL, indexController.post);

routes.get(urls.SOLE_TRADER_DATE_OF_BIRTH, soleTraderDateOfBirthController.get);
routes.post(urls.SOLE_TRADER_DATE_OF_BIRTH, dateOfBirthValidator, soleTraderDateOfBirthController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, soleTraderNameController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, nameValidator, soleTraderNameController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, statementRelevantOfficerController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, statementRelevantOfficerController.post);
routes.get(urls.STOP_NOT_RELEVANT_OFFICER, stopNotRelevantOfficerController.get);

routes.get(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, sectorYouWorkInController.get);
routes.post(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, sectorYouWorkInValidator, sectorYouWorkInController.post);

routes.get(urls.SOLE_TRADER_WHERE_DO_YOU_LIVE, soleTraderWhereDoYouLiveController.get);
routes.post(urls.SOLE_TRADER_WHERE_DO_YOU_LIVE, whereDoYouLiveValidator, soleTraderWhereDoYouLiveController.post);

routes.get(urls.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, soleTraderCorrespondenceAddressManualController.get);
routes.post(urls.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, correspondenceAddressManualValidator, soleTraderCorrespondenceAddressManualController.post);

routes.get(urls.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, soleTraderCorrespondenceAddressAutoLookupController.get);
routes.post(urls.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, correspondenceAddressAutoLookupValidator, soleTraderCorrespondenceAddressAutoLookupController.post);

routes.get(urls.SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, soleTraderCorrespodanceAddressDetailsController.get);
routes.post(urls.SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, correspondenceAddressListValidator, soleTraderCorrespodanceAddressDetailsController.post);

routes.get(urls.SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, soleTraderCorrespondenceAddressConfirmController.get);
routes.post(urls.SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, soleTraderCorrespondenceAddressConfirmController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, soleTraderNationalityController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, nationalityValidator, soleTraderNationalityController.post);

routes.get(urls.TYPE_OF_BUSINESS, typeOfBusinessController.get);
routes.post(urls.TYPE_OF_BUSINESS, typeOfBusinessValidator, typeOfBusinessController.post);

routes.get(urls.OTHER_TYPE_OFBUSINESS, OtherTypeOfBusinessController.get);
routes.post(urls.OTHER_TYPE_OFBUSINESS, otherTypeOfBusinessValidator, OtherTypeOfBusinessController.post);

routes.get(urls.LIMITED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlController.get);
routes.post(urls.LIMITED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlValidator, nameRegisteredWithAmlController.post);

routes.get(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, companyLookupController.get);
routes.post(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, companyNumberValidator, companyLookupController.post);

routes.get(urls.LIMITED_IS_THIS_YOUR_COMPANY, isThisYourCompanyController.get);

routes.get(urls.LIMITED_COMPANY_INACTIVE, companyInactiveController.get);

routes.get(urls.HEALTHCHECK, healthCheckController.get);

routes.get(urls.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, businessMustbeAmlRegisteredController.get);

routes.get(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameValidator, whatIsTheBusinessNameController.post);

routes.get(urls.ACCESSIBILITY_STATEMENT, accessibilityStatementController.get);

export default routes;
