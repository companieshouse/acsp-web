import { Router } from "express";
import * as urls from "../types/pageURL";
import { updateIndexController } from "../controllers";

const updateRoutes = Router();

updateRoutes.get(urls.HOME_URL, updateIndexController.get);
updateRoutes.post(urls.HOME_URL, updateIndexController.post);

export default updateRoutes;
