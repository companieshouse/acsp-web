import { Router } from "express";
import * as urls from "../types/pageURL";
import { closeIndexController, closeWhatWillHappenController } from "../controllers";
import { whatWillHappenValidator } from "../validation/whatWillHappen";

const closeRoutesAcsp = Router();

closeRoutesAcsp.get(urls.HOME_URL, closeIndexController.get);
closeRoutesAcsp.post(urls.HOME_URL, closeIndexController.post);

closeRoutesAcsp.get(urls.CLOSE_WHAT_WILL_HAPPEN, closeWhatWillHappenController.get);
closeRoutesAcsp.post(urls.CLOSE_WHAT_WILL_HAPPEN, whatWillHappenValidator, closeWhatWillHappenController.post);

export default closeRoutesAcsp;
