import { validationResult } from "express-validator";
import { updateAcspWhatIsYourEmailValidator } from "../../../src/validation/updateAcspWhatIsYourEmail";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";

describe("updateAcspWhatIsYourEmailValidator", () => {
    const mockRequest = (body: any, sessionData: any): Request => {
        return {
            body,
            session: {
                getExtraData: jest.fn().mockReturnValue(sessionData)
            }
        } as unknown as Request;
    };

    const runValidation = async (req: Request) => {
        for (const validator of updateAcspWhatIsYourEmailValidator) {
            await validator.run(req);
        }
        return validationResult(req);
    };

    it("should pass validation when a valid new email is provided", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "newemail@example.com", whatIsYourEmailRadio: "A Different Email" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(true);
    });

    it("should fail validation when the email input is empty", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "", whatIsYourEmailRadio: "A Different Email" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("noCorrespondenceEmail");
    });

    it("should fail validation when the email format is incorrect", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "invalid-email", whatIsYourEmailRadio: "A Different Email" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("emailFormatIncorrect");
    });

    it("should fail validation when the new email is the same as the existing email", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "oldemail@example.com", whatIsYourEmailRadio: "A Different Email" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("emailNoChangeUpdateAcsp");
    });

    it("should fail validation when the radio input is empty", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "newemail@example.com", whatIsYourEmailRadio: "" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("emailNoChange");
    });

    it("should fail validation when the radio input matches the existing email", async () => {
        const req = mockRequest(
            { whatIsYourEmailInput: "newemail@example.com", whatIsYourEmailRadio: "oldemail@example.com" },
            { email: "oldemail@example.com" }
        );

        const result = await runValidation(req);
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe("emailNoChange");
    });
});
