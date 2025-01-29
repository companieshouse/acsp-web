import { Router } from "express";
import * as urls from "../types/pageURL";
import {
    correspondenceAddressAutoLookupController,
    correspondenceAddressConfirmController,
    correspondenceAddressListController,
    correspondenceAddressManualController,
    updateIndexController,
    updateWhatIsYourNameController,
    updateWhereDoYouLiveController,
    updateYourDetailsController
} from "../controllers";
import { nameValidator } from "../validation/whatIsYourName";
import { whereDoYouLiveValidator } from "../validation/whereDoYouLive";
import { correspondenceAddressListValidator } from "../validation/correspondanceAddressList";
import { correspondenceAddressAutoLookupValidator } from "../validation/correspondenceAddressAutoLookup";
import { correspondenceAddressManualValidator } from "../validation/correspondenceAddressManual";

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
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, correspondenceAddressManualValidator, correspondenceAddressManualController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, correspondenceAddressAutoLookupValidator, correspondenceAddressAutoLookupController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_LIST, correspondenceAddressListValidator, correspondenceAddressListController.post);

updateRoutes.get(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.get);
updateRoutes.post(urls.UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, correspondenceAddressConfirmController.post);

export default updateRoutes;
