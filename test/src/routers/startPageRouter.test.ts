import app from "../../../src/app";
import supertest from "supertest";
const router = supertest(app);

describe('Start Page Router', () => {
   it("should respond with status 200 for GET /", async () => {
       const response = await supertest(app).get("/");
    });
});