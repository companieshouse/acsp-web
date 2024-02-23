import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const pageNotFoundView: string = "partials/error_404";

export const pageNotFound = (req: Request, res: Response) => {
    return res.status(StatusCodes.NOT_FOUND).render(pageNotFoundView);
};
