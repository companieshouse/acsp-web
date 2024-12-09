import { Router } from "express";
import * as urls from "../types/pageURL";
import { updateIndexController, updateWhatIsYourNameController, updateWhereDoYouLiveController } from "../controllers";

import { nameValidator } from "../validation/whatIsYourName";
import { whereDoYouLiveValidator } from "../validation/whereDoYouLive";

const updateRoutes = Router();

updateRoutes.get(urls.HOME_URL, updateIndexController.get);
updateRoutes.post(urls.HOME_URL, updateIndexController.post);

updateRoutes.get(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, updateWhatIsYourNameController.get);
updateRoutes.post(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, nameValidator, updateWhatIsYourNameController.post);

updateRoutes.get(urls.UPDATE_WHERE_DO_YOU_LIVE, updateWhereDoYouLiveController.get);
updateRoutes.post(urls.UPDATE_WHERE_DO_YOU_LIVE, whereDoYouLiveValidator, updateWhereDoYouLiveController.post);

export default updateRoutes;
