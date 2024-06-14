import assert from "assert";
import supertest from "supertest";
import app from "../../../src/app";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER } from "../../../src/types/pageURL";

describe("E2E Test", () => {
    it("should render stop-not-relevant-officer page", async () => {
        const response = await supertest(app).get(BASE_URL + STOP_NOT_RELEVANT_OFFICER);
        assert(response.text.includes("Stop Not Relevant Officer"));
    });

});
