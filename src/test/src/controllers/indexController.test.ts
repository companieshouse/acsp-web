import mocks from "../../mocks/all_middleware_mock";
import app from "../../../main/app";
import supertest from "supertest"; "supertest";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Home Page tests -", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /register-acsp/home", () => {
        it("should return status 200", async () => {
            await router.get("/register-acsp/home");
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(200);
        });
    });

});
