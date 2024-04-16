import { Request, Response } from "express";

/**
 * Handler for GET request.
 * Responds with a JSON object indicating the status is OK.
 * @param req Express request object
 * @param res Express response object
 */
export const get = async (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
};
