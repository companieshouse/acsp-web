import { createLogger } from "@companieshouse/structured-logging-node";
import { initLogger as initLoggerFn, createAndLogError } from "../../../src/utils/logger";

jest.mock("@companieshouse/structured-logging-node", () => {
    return {
        createLogger: jest.fn()
    };
});

describe("logger.ts", () => {
    const mockErrorFn = jest.fn();
    const mockLogger = {
        error: mockErrorFn
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createLogger as jest.Mock).mockReturnValue(mockLogger);
    });

    describe("initLogger", () => {
        it("should create a logger with APP_NAME env var", () => {
            process.env.APP_NAME = "TestApp";
            const logger = initLoggerFn();
            expect(createLogger).toHaveBeenCalledWith("TestApp");
            expect(logger).toBe(mockLogger);
        });

        it("should create a logger with APPLICATION_NAME if APP_NAME not set", () => {
            delete process.env.APP_NAME;
            const logger = initLoggerFn();
            expect(createLogger).toHaveBeenCalled();
            expect(typeof (createLogger as jest.Mock).mock.calls[0][0]).toBe("string");
            expect(logger).toBe(mockLogger);
        });
    });

    describe("createAndLogError", () => {
        it("Should log and return an error", () => {
            const ERROR_MESSAGE = "Error: Something went wrong";
            const err: Error = createAndLogError(ERROR_MESSAGE);
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toEqual(ERROR_MESSAGE);
            expect(mockErrorFn).toHaveBeenCalledTimes(1);
            expect(mockErrorFn).toHaveBeenCalledWith(expect.stringContaining(ERROR_MESSAGE));
        });
    });
});
