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
    updateAmlMembershipNumberController,
    cancelAllUpdatesController,
    updateProvideAmlDetailsController,
    yourUpdatesController
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
import amlBodyMembershipNumberControllerValidator from "../validation/amlBodyMembershipNumberControllerValidator";
import { yourUpdatesValidator } from "../validation/yourUpdates";
import { whatIsYourEmailValidator } from "../validation/whatIsYourEmail";

const updateRoutesAcsp = Router();

updateRoutesAcsp.get(urls.HOME_URL, updateIndexController.get);
updateRoutesAcsp.post(urls.HOME_URL, updateIndexController.post);

updateRoutesAcsp.get(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.get);
updateRoutesAcsp.post(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.post);

updateRoutesAcsp.get(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, updateWhatIsYourNameController.get);
updateRoutesAcsp.post(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, nameValidator, updateWhatIsYourNameController.post);

updateRoutesAcsp.get(urls.UPDATE_WHERE_DO_YOU_LIVE, updateWhereDoYouLiveController.get);
updateRoutesAcsp.post(urls.UPDATE_WHERE_DO_YOU_LIVE, whereDoYouLiveValidator, updateWhereDoYouLiveController.post);

updateRoutesAcsp.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, correspondenceAddressManualController.get);
updateRoutesAcsp.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, correspondenceAddressManualValidator, correspondenceAddressManualController.post);

updateRoutesAcsp.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupController.get);
updateRoutesAcsp.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, correspondenceAddressAutoLookupController.post);

updateRoutesAcsp.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListController.get);
updateRoutesAcsp.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListValidator, correspondenceAddressListController.post);

updateRoutesAcsp.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.get);
updateRoutesAcsp.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.post);

updateRoutesAcsp.get(urls.UPDATE_BUSINESS_ADDRESS_MANUAL, businessAddressManualController.get);
updateRoutesAcsp.post(urls.UPDATE_BUSINESS_ADDRESS_MANUAL, businessAddressManualValidator, businessAddressManualController.post);

updateRoutesAcsp.get(urls.UPDATE_BUSINESS_ADDRESS_LOOKUP, businessAddressAutoLookupController.get);
updateRoutesAcsp.post(urls.UPDATE_BUSINESS_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, businessAddressAutoLookupController.post);

updateRoutesAcsp.get(urls.UPDATE_BUSINESS_ADDRESS_LIST, businessAddressListController.get);
updateRoutesAcsp.post(urls.UPDATE_BUSINESS_ADDRESS_LIST, businessAddressListValidator, businessAddressListController.post);

updateRoutesAcsp.get(urls.UPDATE_BUSINESS_ADDRESS_CONFIRM, businessAddressConfirmController.get);
updateRoutesAcsp.post(urls.UPDATE_BUSINESS_ADDRESS_CONFIRM, businessAddressConfirmController.post);

updateRoutesAcsp.get(urls.UPDATE_WHAT_IS_THE_BUSINESS_NAME, updateWhatIsTheBusinessNameController.get);
updateRoutesAcsp.post(urls.UPDATE_WHAT_IS_THE_BUSINESS_NAME, unicorporatedWhatIsTheBusinessNameValidator, updateWhatIsTheBusinessNameController.post);

updateRoutesAcsp.get(urls.UPDATE_WHAT_IS_YOUR_EMAIL, updateWhatIsYourEmailAddressController.get);
updateRoutesAcsp.post(urls.UPDATE_WHAT_IS_YOUR_EMAIL, whatIsYourEmailValidator, updateWhatIsYourEmailAddressController.post);

updateRoutesAcsp.get(urls.UPDATE_ADD_AML_SUPERVISOR, addAmlSupervisorController.get);
updateRoutesAcsp.post(urls.UPDATE_ADD_AML_SUPERVISOR, addAmlSupervisorValidator, addAmlSupervisorController.post);

updateRoutesAcsp.get(urls.REMOVE_AML_SUPERVISOR, removeAmlSupervisorController.get);

updateRoutesAcsp.get(urls.UPDATE_APPLICATION_CONFIRMATION, updateApplicationConfirmationController.get);

updateRoutesAcsp.get(urls.CANCEL_AN_UPDATE, cancelAnUpdateController.get);

updateRoutesAcsp.get(urls.AML_MEMBERSHIP_NUMBER, updateAmlMembershipNumberController.get);
updateRoutesAcsp.post(urls.AML_MEMBERSHIP_NUMBER, amlBodyMembershipNumberControllerValidator.call(this), updateAmlMembershipNumberController.post);

updateRoutesAcsp.get(urls.UPDATE_CANCEL_ALL_UPDATES, cancelAllUpdatesController.get);
updateRoutesAcsp.post(urls.UPDATE_CANCEL_ALL_UPDATES, cancelAllUpdatesController.post);

updateRoutesAcsp.get(urls.UPDATE_PROVIDE_AML_DETAILS, updateProvideAmlDetailsController.get);

updateRoutesAcsp.get(urls.UPDATE_CHECK_YOUR_UPDATES, yourUpdatesController.get);
updateRoutesAcsp.post(urls.UPDATE_CHECK_YOUR_UPDATES, yourUpdatesValidator, yourUpdatesController.post);

export default updateRoutesAcsp;
