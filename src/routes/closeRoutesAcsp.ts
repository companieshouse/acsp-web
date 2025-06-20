import { Router } from "express";
import * as urls from "../types/pageURL";
import { cannotUseServiceWhileSuspendedController, closeIndexController, closeWhatWillHappenController, closeConfirmYouWantToCloseController, closeConfirmationAuthorisedAgentClosedController } from "../controllers";
import { whatWillHappenValidator } from "../validation/whatWillHappen";

const closeRoutesAcsp = Router();

closeRoutesAcsp.get(urls.HOME_URL, closeIndexController.get);
closeRoutesAcsp.post(urls.HOME_URL, closeIndexController.post);

closeRoutesAcsp.get(urls.CLOSE_WHAT_WILL_HAPPEN, closeWhatWillHappenController.get);
closeRoutesAcsp.post(urls.CLOSE_WHAT_WILL_HAPPEN, whatWillHappenValidator, closeWhatWillHappenController.post);

closeRoutesAcsp.get(urls.CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, closeConfirmYouWantToCloseController.get);
closeRoutesAcsp.post(urls.CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, closeConfirmYouWantToCloseController.post);

closeRoutesAcsp.get(urls.CLOSE_CONFIRMATION_ACSP_CLOSED, closeConfirmationAuthorisedAgentClosedController.get);

closeRoutesAcsp.get(urls.CANNOT_USE_SERVICE_WHILE_SUSPENDED, cannotUseServiceWhileSuspendedController.get);

export default closeRoutesAcsp;
