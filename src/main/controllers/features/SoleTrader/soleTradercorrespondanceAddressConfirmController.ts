import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    const { firstName, lastName, correspondenceAddress } = req.session.user;

    res.render(config.SOLE_TRADER_CONFIRM_CORRESPONDANCE_ADDRESS, {
        title: "Confirm the correspondence address",
        previousPage: "/sole-trader/correspondance-address-manual",
        firstName,
        lastName,
        correspondenceAddress: correspondenceAddress || req.session.user.originalAddress
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};

    req.session.user.originalAddress = req.session.user.originalAddress || {};
    req.session.user.originalAddress = req.session.user.correspondenceAddress;
    res.redirect("/type-of-acsp");
};
