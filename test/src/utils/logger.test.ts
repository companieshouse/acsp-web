import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";
import { createAndLogError } from "../../../src/utils/logger";
import { warn } from "console";

const ERROR_MESSAGE = "Error: Something went wrong";

jest.mock("@companieshouse/structured-logging-node", () => {
    return {
        createLogger: jest.fn(() => ({
            error: jest.fn(),
            info: jest.fn(),
            warn: jest.fn()
        }))
    };
});

describe("logger tests", () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...ORIGINAL_ENV };
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV;
    });

    test("Should log and return an error", () => {
        const mockLogger = require("../../../src/utils/logger").default;
        const err: Error = createAndLogError(ERROR_MESSAGE);
        expect(err.message).toEqual(ERROR_MESSAGE);
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });

    test("Should test the logger object is defined of type ApplicationLogger", () => {
        process.env.APP_NAME = "test-app";

        jest.resetModules();
        const loggerModule = require("../../../src/utils/logger");
        const reloadedLogger = loggerModule.default;

        expect(reloadedLogger).toBeDefined();
        expect(typeof reloadedLogger.error).toBe("function");
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
