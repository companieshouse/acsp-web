import { Router } from "express";
import * as urls from "../types/pageURL";
import { closeIndexController } from "../controllers";

const closeRoutesAcsp = Router();

closeRoutesAcsp.get(urls.HOME_URL, closeIndexController.get);
closeRoutesAcsp.post(urls.HOME_URL, closeIndexController.post);

export default closeRoutesAcsp;
