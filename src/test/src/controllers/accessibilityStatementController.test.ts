import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, ACCESSIBILITY_STATEMENT } from "../../../main/types/pageURL";

const router = supertest(app);

describe("GET" + ACCESSIBILITY_STATEMENT, () => {
    it("should return status 200", async () => {
        const response = await router.get(BASE_URL + ACCESSIBILITY_STATEMENT);
        expect(response.status).toBe(200);
    });

    it("should render the accessibility statement page", async () => {
        const response = await router.get(BASE_URL + ACCESSIBILITY_STATEMENT);
        expect(response.text).toContain("Accessibility statement for the Companies House service");
    });
});
