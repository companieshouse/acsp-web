import { Request, Response, NextFunction } from "express";
import Axios, { AxiosInstance } from "axios";
import logger from "../../../lib/Logger";
import { getAccessToken } from "../common/__utils/session";
// import {
//     ACSP_SERVICE_TRANSACTION_URI
//   } from "../config";

import { Session } from "@companieshouse/node-session-handler";

export class ACSPServiceClient {

  client: AxiosInstance;

  constructor (baseURL: string) {
      this.client = Axios.create({ baseURL });
  }

  getConfig (session: Session) {
      return {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAccessToken(session)}`
          }
      };
  }

  async startTransaction (req: Request, session: Session) {
      try {
          const config = this.getConfig(session);
          const authToken = getAccessToken(session);
          const response = await this.client.post("/transactions", config);
          logger.info("response");
      } catch (err : any) {
          logger.info(err);
      }

  }

}
