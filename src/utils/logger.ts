import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";
import { APPLICATION_NAME } from "./properties";

let logger: ApplicationLogger;

export const initLogger = (): ApplicationLogger => {
    const applicationName = APPLICATION_NAME;
    logger = createLogger(applicationName);

    return logger;
};

// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

export default initLogger();

export const createAndLogError = (description: string): Error => {
    const error = new Error(description);
    logger.error(`${error.stack}`);
    return error;
};
