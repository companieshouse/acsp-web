import { Router } from "express";
import * as urls from "../types/pageURL";
import { closeIndexController } from "../controllers";

const closeRoutes = Router();

closeRoutes.get(urls.HOME_URL, closeIndexController.get);
closeRoutes.post(urls.HOME_URL, closeIndexController.post);

export default closeRoutes;
