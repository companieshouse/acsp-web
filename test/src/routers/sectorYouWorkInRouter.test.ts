import supertest from "supertest";
import app from "../../../src/app";
const router = supertest(app);

// describe("GET /sector-you-work-in", () => {
//     it("should return status 200", async () => {
//         await router.get("/sector-you-work-in").expect(200);
//     });
// });

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sector-you-work-in", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/sector-you-work-in").send({ sectorYouWorkIn: "AUDITORS_INSOLVENCY_PRACTITIONERS" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST /sector-you-work-in", () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post("/sector-you-work-in").send({ sectorYouWorkIn: "" }).expect(400);
    });
});
