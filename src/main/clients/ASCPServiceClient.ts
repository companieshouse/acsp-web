import { Request, Response, NextFunction } from "express";
import Axios, { AxiosInstance } from "axios";
import logger from "../../../lib/Logger";

export class ACSPServiceClient {
    // const baseURL = "http://localhost:18642/acsp-api/";
    private client: AxiosInstance;

    constructor (baseURL: string) {
        this.client = Axios.create({
            baseURL

        });
    }

    public async getCompany (companyNumber: string): Promise<any> {
        try {
            const response = await this.client.get(`/company/${companyNumber}`);
            logger.info(response.data);
            const errore = response.data = "Errore";
            return errore;
        } catch (err: any) {
            logger.error(err);
            throw err;
        }
    }
}
