import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { Cookie } from "@companieshouse/node-session-handler/lib/session/model/Cookie";
import { IAccessToken, IUserProfile } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { generateRandomBytesBase64 } from "@companieshouse/node-session-handler/lib/utils/CookieUtils";

export function createSessionData (cookieSecret: string): any {
    const cookie: Cookie = Cookie.createNew(cookieSecret);
    const expiryTimeInSeconds = 3600;
    const TEST_USER_EMAIL: string = "test_user@test.co.biz";

    const userProfile: IUserProfile = {
        email: TEST_USER_EMAIL
    };

    const sessionData: any = {};
    sessionData[SessionKey.Id] = cookie.sessionId;
    sessionData[SessionKey.ClientSig] = cookie.signature;
    sessionData[SessionKey.SignInInfo] = {
        [SignInInfoKeys.AccessToken]: createDefaultAccessToken(expiryTimeInSeconds),
        [SignInInfoKeys.UserProfile]: userProfile,
        [SignInInfoKeys.SignedIn]: 0
    };
    sessionData[SessionKey.Expires] = Date.now() + expiryTimeInSeconds * 1000;
    return sessionData;
}

const createDefaultAccessToken = (expiryPeriod: number): IAccessToken => {
    return {
        [AccessTokenKeys.AccessToken]: generateRandomBytesBase64(64),
        [AccessTokenKeys.RefreshToken]: generateRandomBytesBase64(64),
        [AccessTokenKeys.ExpiresIn]: expiryPeriod,
        [AccessTokenKeys.TokenType]: "Bearer"
    };
};
