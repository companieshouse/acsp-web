import { getSessionRequestWithPermission, userId, userMail } from "../../../mocks/session.mock";
import { getLoggedInUserEmail, getLoggedInUserId } from "../../../../src/common/__utils/session";

describe("Session util tests", () => {

    it("should return users email address", () => {
        const session = getSessionRequestWithPermission();
        const res = getLoggedInUserEmail(session);

        expect(res).toBe(userMail);
    });

    it("should return users userId", () => {
        const session = getSessionRequestWithPermission();
        const res = getLoggedInUserId(session);

        expect(res).toBe(userId);
    });
});
