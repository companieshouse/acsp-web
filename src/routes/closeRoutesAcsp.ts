import { Router } from "express";
import * as urls from "../types/pageURL";
import { closeIndexController, closeWhatWillHappenController, closeConfirmYouWantToCloseController, closeConfirmationAuthorisedAgentClosedController, mustBeAuthorisedAgentController } from "../controllers";
import { whatWillHappenValidator } from "../validation/whatWillHappen";

const closeRoutesAcsp = Router();

closeRoutesAcsp.get(urls.HOME_URL, closeIndexController.get);
closeRoutesAcsp.post(urls.HOME_URL, closeIndexController.post);

closeRoutesAcsp.get(urls.CLOSE_WHAT_WILL_HAPPEN, closeWhatWillHappenController.get);
closeRoutesAcsp.post(urls.CLOSE_WHAT_WILL_HAPPEN, whatWillHappenValidator, closeWhatWillHappenController.post);

closeRoutesAcsp.get(urls.CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, closeConfirmYouWantToCloseController.get);
closeRoutesAcsp.post(urls.CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, closeConfirmYouWantToCloseController.post);

closeRoutesAcsp.get(urls.CLOSE_CONFIRMATION_ACSP_CLOSED, closeConfirmationAuthorisedAgentClosedController.get);

closeRoutesAcsp.get(urls.MUST_BE_AUTHORISED_AGENT, mustBeAuthorisedAgentController.get);

export default closeRoutesAcsp;
