import { Router } from "express";
import {
    indexController, soleTraderDateOfBirthController, soleTraderNameController,
    soleTraderWhatIsYourRoleController, stopNotRelevantOfficerController, soleTraderSectorYouWorkInController,
    soleTraderCorrespondenceAddressManualController, soleTraderWhereDoYouLiveController,
    soleTraderNationalityController, typeOfBusinessController, healthCheckController, OtherTypeOfBusinessController, soleTraderCorrespondenceAddressAutoLookupController,
    soleTraderCorrespodanceAddressDetailsController, soleTraderCorrespondenceAddressConfirmController, nameRegisteredWithAmlController, businessMustbeAmlRegisteredController,
    companyLookupController, companyInactiveController, whatIsTheBusinessNameController, accessibilityStatementController, unincorporatedWhatIsYourNameController, unincorporatedNameRegisteredWithAmlController,
    unincorporatedWhatIsYourRoleController, soleTraderWhatIsTheBusinessNameController, limitedWhatIsYourRoleController, limitedSectorYouWorkInController,
    unincorporatedSectorYouWorkInController, isThisYourCompanyController, unincorporatedBusinessAddressManualEntryController

} from "../controllers";

import { correspondenceAddressManualValidator } from "../validation/correspondenceAddressManual";
import { whereDoYouLiveValidator } from "../validation/whereDoYouLive";
import { dateOfBirthValidator } from "../validation/dateOfBirth";
import { nameValidator } from "../validation/whatIsYourName";
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
import { soleTraderWhatIsYourRoleValidator } from "../validation/soleTraderWhatIsYourRole";

const routes = Router();

routes.get(urls.HOME_URL, indexController.get);
routes.post(urls.HOME_URL, indexController.post);

routes.get(urls.SOLE_TRADER_DATE_OF_BIRTH, soleTraderDateOfBirthController.get);
routes.post(urls.SOLE_TRADER_DATE_OF_BIRTH, dateOfBirthValidator, soleTraderDateOfBirthController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, soleTraderNameController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, nameValidator, soleTraderNameController.post);

routes.get(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, soleTraderSectorYouWorkInController.get);
routes.post(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, sectorYouWorkInValidator, soleTraderSectorYouWorkInController.post);

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

routes.get(urls.OTHER_TYPE_OF_BUSINESS, OtherTypeOfBusinessController.get);
routes.post(urls.OTHER_TYPE_OF_BUSINESS, otherTypeOfBusinessValidator, OtherTypeOfBusinessController.post);

routes.get(urls.LIMITED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlController.get);
routes.post(urls.LIMITED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlValidator, nameRegisteredWithAmlController.post);

routes.get(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, companyLookupController.get);
routes.post(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, companyNumberValidator, companyLookupController.post);

routes.get(urls.LIMITED_IS_THIS_YOUR_COMPANY, isThisYourCompanyController.get);
routes.post(urls.LIMITED_IS_THIS_YOUR_COMPANY, isThisYourCompanyController.post);

routes.get(urls.LIMITED_COMPANY_INACTIVE, companyInactiveController.get);

routes.get(urls.HEALTHCHECK, healthCheckController.get);

routes.get(urls.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, businessMustbeAmlRegisteredController.get);

routes.get(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameValidator, whatIsTheBusinessNameController.post);

routes.get(urls.UNINCORPORATED_WHAT_IS_YOUR_NAME, unincorporatedWhatIsYourNameController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_YOUR_NAME, nameValidator, unincorporatedWhatIsYourNameController.post);

routes.get(urls.UNINCORPORATED_NAME_REGISTERED_WITH_AML, unincorporatedNameRegisteredWithAmlController.get);
routes.post(urls.UNINCORPORATED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlValidator, unincorporatedNameRegisteredWithAmlController.post);

routes.get(urls.ACCESSIBILITY_STATEMENT, accessibilityStatementController.get);

routes.get(urls.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, soleTraderWhatIsTheBusinessNameController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameValidator, soleTraderWhatIsTheBusinessNameController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, soleTraderWhatIsYourRoleController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, soleTraderWhatIsYourRoleValidator, soleTraderWhatIsYourRoleController.post);
routes.get(urls.STOP_NOT_RELEVANT_OFFICER, stopNotRelevantOfficerController.get);

routes.get(urls.UNINCORPORATED_WHAT_IS_YOUR_ROLE, unincorporatedWhatIsYourRoleController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_YOUR_ROLE, unincorporatedWhatIsYourRoleController.post);

routes.get(urls.LIMITED_WHAT_IS_YOUR_ROLE, limitedWhatIsYourRoleController.get);
routes.post(urls.LIMITED_WHAT_IS_YOUR_ROLE, limitedWhatIsYourRoleController.post);

routes.get(urls.LIMITED_SECTOR_YOU_WORK_IN, limitedSectorYouWorkInController.get);
routes.post(urls.LIMITED_SECTOR_YOU_WORK_IN, sectorYouWorkInValidator, limitedSectorYouWorkInController.post);

routes.get(urls.UNINCORPORATED_WHICH_SECTOR, unincorporatedSectorYouWorkInController.get);
routes.post(urls.UNINCORPORATED_WHICH_SECTOR, sectorYouWorkInValidator, unincorporatedSectorYouWorkInController.post);

routes.get(urls.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, unincorporatedBusinessAddressManualEntryController.get);
routes.post(urls.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, correspondenceAddressManualValidator, unincorporatedBusinessAddressManualEntryController.post);

export default routes;
