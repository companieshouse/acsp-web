import { Router } from "express";
import * as urls from "../types/pageURL";
import { nameValidator } from "../validation/whatIsYourName";
import { updateIndexController, updateWhatIsYourNameController, updateYourDetailsController } from "../controllers";

const updateRoutes = Router();

updateRoutes.get(urls.HOME_URL, updateIndexController.get);
updateRoutes.post(urls.HOME_URL, updateIndexController.post);
updateRoutes.get(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.get);
updateRoutes.post(urls.UPDATE_YOUR_ANSWERS, updateYourDetailsController.post);

updateRoutes.get(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, updateWhatIsYourNameController.get);
updateRoutes.post(urls.UPDATE_ACSP_WHAT_IS_YOUR_NAME, nameValidator, updateWhatIsYourNameController.post);

export default updateRoutes;
