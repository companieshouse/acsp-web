import { Request, Response } from "express";
import { HomeService } from "../../../services/index/homeService";
import * as config from "../../../config";
import path from "path";

export const get = async (req: Request, res: Response) => {
    const handler = new HomeService();
    console.log("dirname in controller----->", __dirname);
    console.log("controller----->", path.join(__dirname, config.HOME));

    const viewData = await handler.execute(req, res);
    return res.render(config.HOME, viewData);
};
