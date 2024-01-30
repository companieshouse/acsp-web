import { Request, Response, NextFunction } from "express";
import { StatementRelevantOfficerService } from "../../../services/role/statementRelevantOfficerService";
import * as config from "../../../config";

const handler = new StatementRelevantOfficerService();

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const viewData = await handler.execute(req, res);
        res.render(config.SOLE_TRADER_ROLE, viewData);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const selectedRole = req.body.WhatIsYourRole;

        if (selectedRole === "director" || selectedRole === "general-partner" || selectedRole === "member-of-the-partnership" || selectedRole === "sole-trader") { // selectedRole equal to value base on HTML radio element
            res.redirect("/how-are-you-aml-supervised");// endpoint name based on prototype

        } else if (selectedRole === "someone-else") {
            res.redirect("/stop-not-relevant-officer");
        } else {
            res.status(400).send("Invalid role selection");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};
