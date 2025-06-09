import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";
import logger, { createAndLogError } from "../../../src/utils/logger";

const ERROR_MESSAGE = "Error: Something went wrong";

logger.error = jest.fn();

describe("logger tests", () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...ORIGINAL_ENV };
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV;
    });

    test("Should test the logger object is defined of type ApplicationLogger", () => {
        expect(logger).toBeDefined();
        expect(logger).toBeInstanceOf(ApplicationLogger);
    });

    test("Should log and return an error", () => {
        const err: Error = createAndLogError(ERROR_MESSAGE);
        expect(err.message).toEqual(ERROR_MESSAGE);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    test("Should create logger using process.env.APP_NAME", () => {
        process.env.APP_NAME = "test-app";

        jest.resetModules();

        const loggerModule = require("../../../src/utils/logger");
        const reloadedLogger = loggerModule.default;

        expect(reloadedLogger).toBeDefined();
        expect(typeof reloadedLogger.error).toBe("function");
    });
});
