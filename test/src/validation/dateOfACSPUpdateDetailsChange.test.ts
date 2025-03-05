import { dateOfACSPUpdateDetailsChange } from "../../../src/validation/dateOfACSPUpdateDetailsChange";
import { validationResult } from "express-validator";
import express, { Request, Response } from "express";
import supertest from "supertest";

const app = express();
app.use(express.json());

app.post("/test", dateOfACSPUpdateDetailsChange("dob"), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).send("Valid");
});

describe("dateOfACSPUpdateDetailsChange", () => {
    it("should return noData error when all fields are empty", async () => {
        const response = await supertest(app).post("/test").send({
            "dob-day": "",
            "dob-month": "",
            "dob-year": ""
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("noData");
    });

    it("should return noDayMonth error when day and month are empty", async () => {
        const response = await supertest(app).post("/test").send({
            "dob-day": "",
            "dob-month": "",
            "dob-year": "2000"
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("noDayMonth");
    });

    it("should return noMonthYear error when month and year are empty", async () => {
        const response = await supertest(app).post("/test").send({
            "dob-day": "01",
            "dob-month": "",
            "dob-year": ""
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("noMonthYear");
    });

    it("should return nonNumeric error when day, month, or year are not numeric", async () => {
        const response = await supertest(app).post("/test").send({
            "dob-day": "01",
            "dob-month": "abc",
            "dob-year": "2000"
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("nonNumeric");
    });

    it("should return invalid error when month or year are out of range", async () => {
        const response = await supertest(app).post("/test").send({
            "dob-day": "01",
            "dob-month": "13",
            "dob-year": "2000"
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("invalid");
    });

    it("should return dateInFuture error when date is in the future", async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const response = await supertest(app).post("/test").send({
            "dob-day": futureDate.getDate().toString(),
            "dob-month": (futureDate.getMonth() + 1).toString(),
            "dob-year": futureDate.getFullYear().toString()
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("dateInFuture");
    });

    it("should return tooYoung error when age is less than 16", async () => {
        const youngDate = new Date();
        youngDate.setFullYear(youngDate.getFullYear() - 15);
        const response = await supertest(app).post("/test").send({
            "dob-day": youngDate.getDate().toString(),
            "dob-month": (youngDate.getMonth() + 1).toString(),
            "dob-year": youngDate.getFullYear().toString()
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("tooYoung");
    });

    it("should return tooChangeDateOld error when age is more than 110", async () => {
        const oldDate = new Date();
        oldDate.setFullYear(oldDate.getFullYear() - 111);
        const response = await supertest(app).post("/test").send({
            "dob-day": oldDate.getDate().toString(),
            "dob-month": (oldDate.getMonth() + 1).toString(),
            "dob-year": oldDate.getFullYear().toString()
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("tooChangeDateOld");
    });

    it("should return 200 when date is valid", async () => {
        const validDate = new Date();
        validDate.setFullYear(validDate.getFullYear() - 20);
        const response = await supertest(app).post("/test").send({
            "dob-day": validDate.getDate().toString(),
            "dob-month": (validDate.getMonth() + 1).toString(),
            "dob-year": validDate.getFullYear().toString()
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Valid");
    });
});
