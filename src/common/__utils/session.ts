import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler//lib/session/keys/UserProfileKeys";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";

const getSignInInfo = (session: any): ISignInInfo => {
    return session?.data?.[SessionKey.SignInInfo];
};

export const getLoggedInUserEmail = (session: any): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export const getLoggedInUserId = (session: any): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.UserId] as string;
};

export const getLoggedInAcspNumber = (session: any): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AcspNumber] as string;
};

export const getLoggedInAcspRole = (session: any): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AcspRole] as string;
};

export const getOAuthToken = (session: any): string | undefined => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[AccessTokenKeys.AccessToken];
};
