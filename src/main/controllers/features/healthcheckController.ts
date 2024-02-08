import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

export const get = async (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
};
