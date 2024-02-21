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
            return response.data;
        } catch (err:any) {
            if (err.response && err.response.status === 404) {
                // Override the default error message from backend - Request failed with status code 404 to customErrorMessage
                const customErrorMessage = "Enter a valid company number";
                logger.error(customErrorMessage);
                throw new Error(customErrorMessage);
            } else {
                logger.error(err);
                throw err;
            }
        }
    }

}
