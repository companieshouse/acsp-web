import { validationResult } from "express-validator";
import { whatIsYourEmailValidator } from "../../../src/validation/whatIsYourEmail";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";

describe("whatIsYourEmailValidator", () => {
    const mockSession = { getExtraData: jest.fn() } as unknown as Session;

    const mockRequest = { body: {}, session: mockSession } as unknown as Request;

    const runValidation = async (req: Request) => {
        for (const validator of whatIsYourEmailValidator) {
            await validator.run(req);
        }
        return validationResult(req);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should pass validation when a valid new email is provided", async () => {
        mockRequest.body = {
            whatIsYourEmailInput: "newemail@example.com",
            whatIsYourEmailRadio: "A Different Email"
        };
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "oldemail@example.com" });

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(true);
    });

    it("should fail validation when no email is provided", async () => {
        mockRequest.body = {
            whatIsYourEmailInput: "",
            whatIsYourEmailRadio: "A Different Email"
        };

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0]?.msg).toBe("noEmail");
    });

    it("should fail validation when an invalid email format is provided", async () => {
        mockRequest.body = {
            whatIsYourEmailInput: "invalid-email",
            whatIsYourEmailRadio: "A Different Email"
        };

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0]?.msg).toBe("noEmail");
    });

    it("should fail validation when the email has not changed", async () => {
        mockRequest.body = {
            whatIsYourEmailInput: "sameemail@example.com",
            whatIsYourEmailRadio: "A Different Email"
        };
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "sameemail@example.com" });

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0]?.msg).toBe("noEmail");
    });

    it("should fail validation when the radio button is not selected", async () => {
        mockRequest.body = {
            whatIsYourEmailRadio: ""
        };

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noEmail");
    });

    it("should fail validation when the radio button value matches the existing email", async () => {
        mockRequest.body = {
            whatIsYourEmailRadio: "sameemail@example.com"
        };
        (mockSession.getExtraData as jest.Mock).mockReturnValue({ email: "sameemail@example.com" });

        const result = await runValidation(mockRequest);

        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0]?.msg).toBe("noEmail");
    });
});
