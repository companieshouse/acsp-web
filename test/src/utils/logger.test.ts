import { createLogger } from "@companieshouse/structured-logging-node";
import { initLogger as initLoggerFn, createAndLogError } from "../../../src/utils/logger";

jest.mock("@companieshouse/structured-logging-node", () => ({
    createLogger: jest.fn()
}));

jest.mock("../../../src/utils/properties", () => ({
    APPLICATION_NAME: "test-application-name"
}));

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
        it("should create a logger with APP_NAME ", () => {
            const logger = initLoggerFn();
            expect(createLogger).toHaveBeenCalledWith("test-application-name");
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
