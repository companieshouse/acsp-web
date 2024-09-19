import { Router } from "express";
import {
    accessibilityStatementController,
    healthCheckController,
    indexController,
    signOutController,
    limitedBusinessMustbeAmlRegisteredController,
    limitedCompanyInactiveController,
    limitedCompanyLookupController,
    limitedIsThisYourCompanyController,
    limitedNameRegisteredWithAmlController,
    limitedSectorYouWorkInController,
    limitedWhatIsYourRoleController,
    limitedWhichSectorOtherController,
    limitedSelectAmlSupervisorController,
    limitedCorrespondenceAddressManualController,
    limitedCorrespondenceAddressAutoLookupController,
    limitedCorrespondenceAddressListController,
    limitedCorrespondenceAddressConfirmController,
    limitedAddressCorrespondanceSelectorController,
    soleTraderCorrespodanceAddressDetailsController,
    soleTraderCorrespondenceAddressAutoLookupController,
    soleTraderCorrespondenceAddressConfirmController,
    soleTraderCorrespondenceAddressManualController,
    soleTraderDateOfBirthController, soleTraderNameController,
    soleTraderNationalityController,
    otherTypeOfBusinessController,
    soleTraderSectorYouWorkInController,
    typeOfBusinessController,
    soleTraderWhatIsTheBusinessNameController,
    soleTraderWhatIsYourRoleController,
    soleTraderWhereDoYouLiveController,
    soleTraderWhichSectorOtherController,
    soleTraderSelectAmlSupervisorController,
    stopNotRelevantOfficerController,
    unincorporatedBusinessAddressAutoLookupController,
    unincorporatedBusinessAddressListController,
    unincorporatedNameRegisteredWithAmlController,
    unincorporatedSectorYouWorkInController, unincorporatedWhichSectorOtherController,
    unincorporatedWhatIsYourNameController,
    unincorporatedWhatIsYourRoleController,
    whatIsTheBusinessNameController,
    unincorporatedBusinessAddressManualEntryController,
    addressCorrespondanceSelectorController,
    unincorporatedConfirmYourBusinessAddressController,
    unincorporatedCorrespondenceAddressManualController,
    unincorporatedCorrespondenceAddressConfirmController,
    unincorporatedCorrespondenceAddressAutoLookupController,
    unincorporatedCorrespondenceAddressListController,
    unincorporatedSelectAmlSupervisorController,
    checkYourAnswersController,
    applicationConfirmationController,
    yourResponsibilitiesController,
    amlBodyMembershipNumberController,
    checkAmlDetailsController,
    paymentCallbackController,
    savedApplicationController,
    checkSavedApplicationController,
    resumeJourneyController,
    cannotSubmitAnotherApplicationController,
    limitedWhatIsYourEmailController,
    soleTraderWhatIsYourEmailAddressController,
    unincorporatedWhatIsYourEmailController
} from "../controllers";

import * as urls from "../types/pageURL";
import { businessAddressListValidator } from "../validation/businessAddressList";
import { companyNumberValidator } from "../validation/companyLookup";
import { correspondenceAddressListValidator } from "../validation/correspondanceAddressList";
import { correspondenceAddressAutoLookupValidator } from "../validation/correspondenceAddressAutoLookup";
import { manualAddressValidator } from "../validation/commonAddressManual";
import { dateOfBirthValidator } from "../validation/dateOfBirth";
import { nameRegisteredWithAmlValidator } from "../validation/nameRegisteredWithAml";
import { nationalityValidator } from "../validation/nationality";
import { otherTypeOfBusinessValidator } from "../validation/otherTypeOfBusiness";
import { whatIsYourRoleValidator } from "../validation/whatIsYourRole";
import { typeOfBusinessValidator } from "../validation/typeOfBusiness";
import { soleTraderWhatIsTheBusinessNameValidator } from "../validation/soleTraderWhatIsTheBusinessName";
import { unicorporatedWhatIsTheBusinessNameValidator } from "../validation/unicorporatedWhatIsTheBusinessName";
import { nameValidator } from "../validation/whatIsYourName";
import { whereDoYouLiveValidator } from "../validation/whereDoYouLive";
import { companyAuthenticationMiddleware } from "../middleware/company_authentication_middleware";
import { addressCorrespondanceSelectorValidator } from "../validation/addressCorrespondanceSelector";
import { selectAmlSupervisorValidator } from "../validation/selectAmlSupervisor";
import amlBodyMembershipNumberControllerValidator from "../validation/amlBodyMembershipNumber";
import { selectsignOutValidator } from "../validation/signOut";
import { selectSavedApplicationValidator } from "../validation/savedApplication";
import { whatIsYourEmailValidator } from "../validation/whatIsYourEmail";

const routes = Router();

routes.get(urls.HOME_URL, indexController.get);
routes.post(urls.HOME_URL, indexController.post);

routes.get(urls.ACCESSIBILITY_STATEMENT, accessibilityStatementController.get);

routes.get(urls.STOP_NOT_RELEVANT_OFFICER, stopNotRelevantOfficerController.get);

routes.get(urls.HEALTHCHECK, healthCheckController.get);

routes.get(urls.CHECK_YOUR_ANSWERS, checkYourAnswersController.get);
routes.post(urls.CHECK_YOUR_ANSWERS, checkYourAnswersController.post);

routes.get(urls.SIGN_OUT_URL, signOutController.get);
routes.post(urls.SIGN_OUT_URL, selectsignOutValidator, signOutController.post);

routes.get(urls.CONFIRMATION, applicationConfirmationController.get);

routes.get(urls.YOUR_RESPONSIBILITIES, yourResponsibilitiesController.get);
routes.post(urls.YOUR_RESPONSIBILITIES, yourResponsibilitiesController.post);

routes.get(urls.AML_MEMBERSHIP_NUMBER, amlBodyMembershipNumberController.get);
routes.post(urls.AML_MEMBERSHIP_NUMBER, amlBodyMembershipNumberControllerValidator.call(this), amlBodyMembershipNumberController.post);

routes.get(urls.AML_BODY_DETAILS_CONFIRM, checkAmlDetailsController.get);
routes.post(urls.AML_BODY_DETAILS_CONFIRM, checkAmlDetailsController.post);

routes.get(urls.SAVED_APPLICATION, savedApplicationController.get);
routes.post(urls.SAVED_APPLICATION, selectSavedApplicationValidator, savedApplicationController.post);

routes.get(urls.PAYMENT_CALLBACK_URL, paymentCallbackController.get);

routes.get(urls.CHECK_SAVED_APPLICATION, checkSavedApplicationController.get);

routes.get(urls.CANNOT_SUBMIT_ANOTHER_APPLICATION, cannotSubmitAnotherApplicationController.get);

// SOLE_TRADER
routes.get(urls.SOLE_TRADER_DATE_OF_BIRTH, soleTraderDateOfBirthController.get);
routes.post(urls.SOLE_TRADER_DATE_OF_BIRTH, dateOfBirthValidator, soleTraderDateOfBirthController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, soleTraderNameController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_NAME, nameValidator, soleTraderNameController.post);

routes.get(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, soleTraderSectorYouWorkInController.get);
routes.post(urls.SOLE_TRADER_SECTOR_YOU_WORK_IN, soleTraderSectorYouWorkInController.post);

routes.get(urls.SOLE_TRADER_WHICH_SECTOR_OTHER, soleTraderWhichSectorOtherController.get);
routes.post(urls.SOLE_TRADER_WHICH_SECTOR_OTHER, soleTraderWhichSectorOtherController.post);

routes.get(urls.SOLE_TRADER_WHERE_DO_YOU_LIVE, soleTraderWhereDoYouLiveController.get);
routes.post(urls.SOLE_TRADER_WHERE_DO_YOU_LIVE, whereDoYouLiveValidator, soleTraderWhereDoYouLiveController.post);

routes.get(urls.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, soleTraderCorrespondenceAddressManualController.get);
routes.post(urls.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, manualAddressValidator, soleTraderCorrespondenceAddressManualController.post);

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

routes.get(urls.OTHER_TYPE_OF_BUSINESS, otherTypeOfBusinessController.get);
routes.post(urls.OTHER_TYPE_OF_BUSINESS, otherTypeOfBusinessValidator, otherTypeOfBusinessController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, soleTraderWhatIsTheBusinessNameController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, soleTraderWhatIsTheBusinessNameValidator, soleTraderWhatIsTheBusinessNameController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, soleTraderWhatIsYourRoleController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_ROLE, whatIsYourRoleValidator, soleTraderWhatIsYourRoleController.post);

routes.get(urls.SOLE_TRADER_SELECT_AML_SUPERVISOR, soleTraderSelectAmlSupervisorController.get);
routes.post(urls.SOLE_TRADER_SELECT_AML_SUPERVISOR, selectAmlSupervisorValidator, soleTraderSelectAmlSupervisorController.post);

routes.get(urls.SOLE_TRADER_WHAT_IS_YOUR_EMAIL, soleTraderWhatIsYourEmailAddressController.get);
routes.post(urls.SOLE_TRADER_WHAT_IS_YOUR_EMAIL, whatIsYourEmailValidator, soleTraderWhatIsYourEmailAddressController.post);

// LIMITED
routes.get(urls.LIMITED_NAME_REGISTERED_WITH_AML, limitedNameRegisteredWithAmlController.get);
routes.post(urls.LIMITED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlValidator, limitedNameRegisteredWithAmlController.post);

routes.get(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, limitedCompanyLookupController.get);
routes.post(urls.LIMITED_WHAT_IS_THE_COMPANY_NUMBER, companyNumberValidator, limitedCompanyLookupController.post);

routes.get(urls.LIMITED_SECTOR_YOU_WORK_IN, limitedSectorYouWorkInController.get);
routes.post(urls.LIMITED_SECTOR_YOU_WORK_IN, limitedSectorYouWorkInController.post);

routes.get(urls.LIMITED_WHICH_SECTOR_OTHER, limitedWhichSectorOtherController.get);
routes.post(urls.LIMITED_WHICH_SECTOR_OTHER, limitedWhichSectorOtherController.post);

routes.get(urls.LIMITED_IS_THIS_YOUR_COMPANY, limitedIsThisYourCompanyController.get);
routes.post(urls.LIMITED_IS_THIS_YOUR_COMPANY, limitedIsThisYourCompanyController.post);

routes.get(urls.LIMITED_COMPANY_INACTIVE, limitedCompanyInactiveController.get);

routes.get(urls.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, limitedBusinessMustbeAmlRegisteredController.get);

routes.get(urls.LIMITED_WHAT_IS_YOUR_ROLE, companyAuthenticationMiddleware, limitedWhatIsYourRoleController.get);
routes.post(urls.LIMITED_WHAT_IS_YOUR_ROLE, whatIsYourRoleValidator, limitedWhatIsYourRoleController.post);

routes.get(urls.LIMITED_SELECT_AML_SUPERVISOR, limitedSelectAmlSupervisorController.get);
routes.post(urls.LIMITED_SELECT_AML_SUPERVISOR, selectAmlSupervisorValidator, limitedSelectAmlSupervisorController.post);

routes.get(urls.LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, limitedCorrespondenceAddressManualController.get);
routes.post(urls.LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, manualAddressValidator, limitedCorrespondenceAddressManualController.post);

routes.get(urls.LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, limitedCorrespondenceAddressAutoLookupController.get);
routes.post(urls.LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, limitedCorrespondenceAddressAutoLookupController.post);

routes.get(urls.LIMITED_CORRESPONDENCE_ADDRESS_LIST, limitedCorrespondenceAddressListController.get);
routes.post(urls.LIMITED_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListValidator, limitedCorrespondenceAddressListController.post);

routes.get(urls.LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, limitedCorrespondenceAddressConfirmController.get);
routes.post(urls.LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, limitedCorrespondenceAddressConfirmController.post);

routes.get(urls.LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, limitedAddressCorrespondanceSelectorController.get);
routes.post(urls.LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, addressCorrespondanceSelectorValidator, limitedAddressCorrespondanceSelectorController.post);

routes.get(urls.LIMITED_WHAT_IS_YOUR_EMAIL, limitedWhatIsYourEmailController.get);
routes.post(urls.LIMITED_WHAT_IS_YOUR_EMAIL, whatIsYourEmailValidator, limitedWhatIsYourEmailController.post);

// UNINCORPORATED
routes.get(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, whatIsTheBusinessNameController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, unicorporatedWhatIsTheBusinessNameValidator, whatIsTheBusinessNameController.post);

routes.get(urls.UNINCORPORATED_WHAT_IS_YOUR_NAME, unincorporatedWhatIsYourNameController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_YOUR_NAME, nameValidator, unincorporatedWhatIsYourNameController.post);

routes.get(urls.UNINCORPORATED_NAME_REGISTERED_WITH_AML, unincorporatedNameRegisteredWithAmlController.get);
routes.post(urls.UNINCORPORATED_NAME_REGISTERED_WITH_AML, nameRegisteredWithAmlValidator, unincorporatedNameRegisteredWithAmlController.post);

routes.get(urls.UNINCORPORATED_WHAT_IS_YOUR_ROLE, unincorporatedWhatIsYourRoleController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_YOUR_ROLE, whatIsYourRoleValidator, unincorporatedWhatIsYourRoleController.post);

routes.get(urls.UNINCORPORATED_WHICH_SECTOR, unincorporatedSectorYouWorkInController.get);
routes.post(urls.UNINCORPORATED_WHICH_SECTOR, unincorporatedSectorYouWorkInController.post);

routes.get(urls.UNINCORPORATED_WHICH_SECTOR_OTHER, unincorporatedWhichSectorOtherController.get);
routes.post(urls.UNINCORPORATED_WHICH_SECTOR_OTHER, unincorporatedWhichSectorOtherController.post);

routes.get(urls.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, unincorporatedBusinessAddressAutoLookupController.get);
routes.post(urls.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, unincorporatedBusinessAddressAutoLookupController.post);

routes.get(urls.UNINCORPORATED_BUSINESS_ADDRESS_LIST, unincorporatedBusinessAddressListController.get);
routes.post(urls.UNINCORPORATED_BUSINESS_ADDRESS_LIST, businessAddressListValidator, unincorporatedBusinessAddressListController.post);

routes.get(urls.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, unincorporatedBusinessAddressManualEntryController.get);
routes.post(urls.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, manualAddressValidator, unincorporatedBusinessAddressManualEntryController.post);

routes.get(urls.UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, unincorporatedConfirmYourBusinessAddressController.get);
routes.post(urls.UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, unincorporatedConfirmYourBusinessAddressController.post);

routes.get(urls.UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, addressCorrespondanceSelectorController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, addressCorrespondanceSelectorValidator, addressCorrespondanceSelectorController.post);

routes.get(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, unincorporatedCorrespondenceAddressManualController.get);
routes.post(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, manualAddressValidator, unincorporatedCorrespondenceAddressManualController.post);

routes.get(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, unincorporatedCorrespondenceAddressConfirmController.get);
routes.post(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, unincorporatedCorrespondenceAddressConfirmController.post);

routes.get(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, unincorporatedCorrespondenceAddressAutoLookupController.get);
routes.post(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, unincorporatedCorrespondenceAddressAutoLookupController.post);

routes.get(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, unincorporatedCorrespondenceAddressListController.get);
routes.post(urls.UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListValidator, unincorporatedCorrespondenceAddressListController.post);

routes.get(urls.UNINCORPORATED_SELECT_AML_SUPERVISOR, unincorporatedSelectAmlSupervisorController.get);
routes.post(urls.UNINCORPORATED_SELECT_AML_SUPERVISOR, selectAmlSupervisorValidator, unincorporatedSelectAmlSupervisorController.post);

routes.get(urls.UNINCORPORATED_WHAT_IS_YOUR_EMAIL, unincorporatedWhatIsYourEmailController.get);
routes.post(urls.UNINCORPORATED_WHAT_IS_YOUR_EMAIL, whatIsYourEmailValidator, unincorporatedWhatIsYourEmailController.post);

routes.get(urls.RESUME_JOURNEY, resumeJourneyController.get);

export default routes;
