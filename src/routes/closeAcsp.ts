import { Router } from "express";
import * as urls from "../types/pageURL";
import { closeIndexController } from "../controllers";

const closeRoutes = Router();

closeRoutes.get(urls.CLOSE_ACSP, closeIndexController.get);
closeRoutes.post(urls.CLOSE_ACSP, closeIndexController.post);

export default closeRoutes;
