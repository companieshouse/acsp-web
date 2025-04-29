import { whatIsYourEmailValidator, ProcessType } from "../../../src/validation/whatIsYourEmail";
import { validationResult } from "express-validator";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../src/common/__utils/constants";

describe("whatIsYourEmailValidator", () => {
    const mockSession = {
        getExtraData: jest.fn()
    } as unknown as Session;

    const mockRequest = {
        body: {},
        session: mockSession
    } as unknown as Request;

    const runValidation = async (req: Request, type: ProcessType) => {
        const validations = whatIsYourEmailValidator(type);
        for (const validation of validations) {
            await validation.run(req);
        }
        return validationResult(req);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if 'whatIsYourEmailInput' is empty during registration", async () => {
        mockRequest.body = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: ""
        };

        const result = await runValidation(mockRequest, "registration");
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });

    it("should return an error if 'whatIsYourEmailInput' is not a valid email", async () => {
        mockRequest.body = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "invalid-email"
        };

        const result = await runValidation(mockRequest, "registration");
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });

    it("should return an error if the email has not changed during update", async () => {
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "test@example.com" });
        mockRequest.body = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "test@example.com"
        };

        const result = await runValidation(mockRequest, "update");
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });

    it("should pass validation if a valid new email is provided", async () => {
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "test@example.com" });
        mockRequest.body = {
            whatIsYourEmailRadio: "A Different Email",
            whatIsYourEmailInput: "new@example.com"
        };

        const result = await runValidation(mockRequest, "update");
        expect(result.isEmpty()).toBe(false);
    });

    it("should return an error if 'whatIsYourEmailRadio' is empty", async () => {
        mockRequest.body = {
            whatIsYourEmailRadio: ""
        };

        const result = await runValidation(mockRequest, "registration");
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });

    it("should return an error if the email has not changed in 'whatIsYourEmailRadio'", async () => {
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "test@example.com" });
        mockRequest.body = {
            whatIsYourEmailRadio: "test@example.com"
        };

        const result = await runValidation(mockRequest, "update");
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });
});
