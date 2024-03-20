import mocks from "../../mocks/all_middleware_mock";
import app from "../../../main/app";
import supertest from "supertest";
import { LIMITED_IS_THIS_YOUR_COMPANY, BASE_URL, LIMITED_COMPANY_INACTIVE } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Limited Company Controller Tests", () => {
    it("should render the view with company details", async () => {
        const res = await router.get(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(res.status).toBe(200);// render company number page
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + LIMITED_IS_THIS_YOUR_COMPANY, () => {
    it("should redirect to authentication code page for active company", async () => {
        const res = await router.post(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY);
        expect(mocks.mockSessionMiddlewareWithInactiveCompany).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toContain(BASE_URL + LIMITED_COMPANY_INACTIVE);
    });
});
