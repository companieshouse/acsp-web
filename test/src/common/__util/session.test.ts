import { getSessionRequestWithPermission, userId, userMail, acspNumber, acspRole } from "../../../mocks/session.mock";
import { getLoggedInAcspNumber, getLoggedInAcspRole, getLoggedInUserEmail, getLoggedInUserId } from "../../../../src/common/__utils/session";

describe("Session util tests", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
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

    it("should return acsp number", () => {
        const session = getSessionRequestWithPermission();
        const res = getLoggedInAcspNumber(session);

        expect(res).toBe(acspNumber);
    });

    it("should return acsp role", () => {
        const session = getSessionRequestWithPermission();
        const res = getLoggedInAcspRole(session);

        expect(res).toBe(acspRole);
    });
});
