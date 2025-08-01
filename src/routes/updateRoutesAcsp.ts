import { Router } from "express";
import * as urls from "../types/pageURL";
import {
    correspondenceAddressAutoLookupController,
    correspondenceAddressConfirmController,
    correspondenceAddressListController,
    correspondenceAddressManualController,
    businessAddressAutoLookupController,
    businessAddressConfirmController,
    businessAddressListController,
    businessAddressManualController,
    updateIndexController,
    updateWhatIsYourNameController,
    updateWhereDoYouLiveController,
    updateYourDetailsController,
    updateWhatIsTheBusinessNameController,
    updateWhatIsYourEmailAddressController,
    cancelAnUpdateController,
    updateApplicationConfirmationController,
    addAmlSupervisorController,
    removeAmlSupervisorController,
    dateOfTheChangeController,
    updateAmlMembershipNumberController,
    cancelAllUpdatesController,
    updateProvideAmlDetailsController,
    yourUpdatesController,
    mustBeAuthorisedAgentController
} from "../controllers";
import { nameValidator } from "../validation/whatIsYourName";
import { whereDoYouLiveValidator } from "../validation/whereDoYouLive";
import { correspondenceAddressListValidator } from "../validation/correspondanceAddressList";
import { correspondenceAddressAutoLookupValidator } from "../validation/correspondenceAddressAutoLookup";
import { correspondenceAddressManualValidator } from "../validation/correspondenceAddressManual";
import { unicorporatedWhatIsTheBusinessNameValidator } from "../validation/unicorporatedWhatIsTheBusinessName";
import { businessAddressManualValidator } from "../validation/businessAddressManual";
import { businessAddressListValidator } from "../validation/businessAddressList";
import { addAmlSupervisorValidator } from "../validation/addAmlSupervisor";
import { amlBodyMembershipNumberValidator } from "../validation/amlBodyMembershipNumberValidator";
import { yourUpdatesValidator } from "../validation/yourUpdates";
import { dateOfACSPUpdateDetailsChange } from "../validation/dateOfACSPUpdateDetailsChange";
import { whatIsYourEmailValidator } from "../validation/whatIsYourEmail";
import { REGISTERED_OFFICE_ADDRESS, SERVICE_ADDRESS, UPDATE } from "../common/__utils/constants";

const updateRoutes = Router();

updateRoutes.get(urls.HOME_URL, updateIndexController.get);
updateRoutes.post(urls.HOME_URL, updateIndexController.post);

updateRoutes.get(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.get);
updateRoutes.post(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.post);

updateRoutes.get(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, updateWhatIsYourNameController.get);
updateRoutes.post(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, nameValidator, updateWhatIsYourNameController.post);

updateRoutes.get(urls.UPDATE_WHERE_DO_YOU_LIVE, updateWhereDoYouLiveController.get);
updateRoutes.post(urls.UPDATE_WHERE_DO_YOU_LIVE, whereDoYouLiveValidator, updateWhereDoYouLiveController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, correspondenceAddressManualController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, correspondenceAddressManualValidator(SERVICE_ADDRESS), correspondenceAddressManualController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator(SERVICE_ADDRESS), correspondenceAddressAutoLookupController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListValidator(UPDATE), correspondenceAddressListController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.post);

updateRoutes.get(urls.UPDATE_BUSINESS_ADDRESS_MANUAL, businessAddressManualController.get);
updateRoutes.post(urls.UPDATE_BUSINESS_ADDRESS_MANUAL, businessAddressManualValidator(REGISTERED_OFFICE_ADDRESS), businessAddressManualController.post);

updateRoutes.get(urls.UPDATE_BUSINESS_ADDRESS_LOOKUP, businessAddressAutoLookupController.get);
updateRoutes.post(urls.UPDATE_BUSINESS_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator(REGISTERED_OFFICE_ADDRESS), businessAddressAutoLookupController.post);

updateRoutes.get(urls.UPDATE_BUSINESS_ADDRESS_LIST, businessAddressListController.get);
updateRoutes.post(urls.UPDATE_BUSINESS_ADDRESS_LIST, businessAddressListValidator(UPDATE), businessAddressListController.post);

updateRoutes.get(urls.UPDATE_BUSINESS_ADDRESS_CONFIRM, businessAddressConfirmController.get);
updateRoutes.post(urls.UPDATE_BUSINESS_ADDRESS_CONFIRM, businessAddressConfirmController.post);

updateRoutes.get(urls.UPDATE_WHAT_IS_THE_BUSINESS_NAME, updateWhatIsTheBusinessNameController.get);
updateRoutes.post(urls.UPDATE_WHAT_IS_THE_BUSINESS_NAME, unicorporatedWhatIsTheBusinessNameValidator("businessName"), updateWhatIsTheBusinessNameController.post);

updateRoutes.get(urls.UPDATE_WHAT_IS_THE_COMPANY_NAME, updateWhatIsTheBusinessNameController.get);
updateRoutes.post(urls.UPDATE_WHAT_IS_THE_COMPANY_NAME, unicorporatedWhatIsTheBusinessNameValidator("companyName"), updateWhatIsTheBusinessNameController.post);

updateRoutes.get(urls.UPDATE_WHAT_IS_YOUR_EMAIL, updateWhatIsYourEmailAddressController.get);
updateRoutes.post(urls.UPDATE_WHAT_IS_YOUR_EMAIL, whatIsYourEmailValidator(UPDATE), updateWhatIsYourEmailAddressController.post);

updateRoutes.get(urls.UPDATE_ADD_AML_SUPERVISOR, addAmlSupervisorController.get);
updateRoutes.post(urls.UPDATE_ADD_AML_SUPERVISOR, addAmlSupervisorValidator, addAmlSupervisorController.post);

updateRoutes.get(urls.REMOVE_AML_SUPERVISOR, removeAmlSupervisorController.get);

updateRoutes.get(urls.UPDATE_DATE_OF_THE_CHANGE, dateOfTheChangeController.get);
updateRoutes.post(urls.UPDATE_DATE_OF_THE_CHANGE, dateOfACSPUpdateDetailsChange("change"), dateOfTheChangeController.post);

updateRoutes.get(urls.UPDATE_APPLICATION_CONFIRMATION, updateApplicationConfirmationController.get);

updateRoutes.get(urls.CANCEL_AN_UPDATE, cancelAnUpdateController.get);

updateRoutes.get(urls.AML_MEMBERSHIP_NUMBER, updateAmlMembershipNumberController.get);
updateRoutes.post(urls.AML_MEMBERSHIP_NUMBER, amlBodyMembershipNumberValidator.call(this), updateAmlMembershipNumberController.post);

updateRoutes.get(urls.UPDATE_CANCEL_ALL_UPDATES, cancelAllUpdatesController.get);
updateRoutes.post(urls.UPDATE_CANCEL_ALL_UPDATES, cancelAllUpdatesController.post);

updateRoutes.get(urls.UPDATE_PROVIDE_AML_DETAILS, updateProvideAmlDetailsController.get);

updateRoutes.get(urls.UPDATE_CHECK_YOUR_UPDATES, yourUpdatesController.get);
updateRoutes.post(urls.UPDATE_CHECK_YOUR_UPDATES, yourUpdatesValidator, yourUpdatesController.post);

updateRoutes.get(urls.MUST_BE_AUTHORISED_AGENT, mustBeAuthorisedAgentController.get);

export default updateRoutes;
