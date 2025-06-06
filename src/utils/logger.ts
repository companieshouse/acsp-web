import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";
import { APPLICATION_NAME } from "./properties";

const logger: ApplicationLogger = createLogger(process.env.APP_NAME || APPLICATION_NAME);

// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

export default logger;

export const createAndLogError = (description: string): Error => {
    const error = new Error(description);
    logger.error(`${error.stack}`);
    return error;
};
