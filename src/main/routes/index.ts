import { Router } from "express";
import { indexController } from "../controllers";
import * as config from "../config";

const router = Router();

router.get(config.HOME, indexController.get);

export default router;
