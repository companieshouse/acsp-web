import { Router } from "express";
import * as urls from "../types/pageURL";
import { updateIndexController, updateWhatIsYourNameController } from "../controllers";

import { nameValidator } from "../validation/whatIsYourName";

const updateRoutes = Router();

updateRoutes.get(urls.HOME_URL, updateIndexController.get);
updateRoutes.post(urls.HOME_URL, updateIndexController.post);

updateRoutes.get(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, updateWhatIsYourNameController.get);
updateRoutes.post(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, nameValidator, updateWhatIsYourNameController.post);

export default updateRoutes;
