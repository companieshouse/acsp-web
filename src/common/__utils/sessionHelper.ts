import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import {
    ACSP_DETAILS,
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_UPDATE_PREVIOUS_PAGE_URL,
    ADDRESS_LIST,
    ADD_AML_BODY_UPDATE,
    AML_REMOVAL_BODY,
    AML_REMOVAL_INDEX,
    AML_REMOVED_BODY_DETAILS,
    APPLICATION_ID,
    COMPANY,
    COMPANY_DETAILS,
    COMPANY_NUMBER,
    NEW_AML_BODY,
    PREVIOUS_PAGE_URL,
    RESUME_APPLICATION_ID,
    SUBMISSION_ID,
    UNINCORPORATED_AML_SELECTED_OPTION,
    UNINCORPORATED_CORRESPONDENCE_ADDRESS,
    UPDATE_SUBMISSION_ID,
    USER_DATA
} from "./constants";

export const saveDataInSession = async (req: Request, name: string, value: any) => {
    const session: Session = req.session as any as Session;
    session.setExtraData(name, value);
};

export async function getSessionValue (req: Request, name: string) {
    const session: Session = req.session as any as Session;
    return session.getExtraData(name);
}

export const deleteAllSessionData = async (session: Session) => {
    session.deleteExtraData(USER_DATA);
    session.deleteExtraData(SUBMISSION_ID);
    session.deleteExtraData(APPLICATION_ID);
    session.deleteExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS);
    session.deleteExtraData(RESUME_APPLICATION_ID);
    session.deleteExtraData("payment-nonce");
    session.deleteExtraData(COMPANY_DETAILS);
    session.deleteExtraData(COMPANY_NUMBER);
    session.deleteExtraData(COMPANY);
    session.deleteExtraData(PREVIOUS_PAGE_URL);
    session.deleteExtraData("resume_application");
    session.deleteExtraData(ADDRESS_LIST);
    session.deleteExtraData(UNINCORPORATED_AML_SELECTED_OPTION);
    session.deleteExtraData(UPDATE_SUBMISSION_ID);
    session.deleteExtraData(AML_REMOVED_BODY_DETAILS);
    session.deleteExtraData(AML_REMOVAL_INDEX);
    session.deleteExtraData(AML_REMOVAL_BODY);
    session.deleteExtraData(ADD_AML_BODY_UPDATE);
    session.deleteExtraData(NEW_AML_BODY);
    session.deleteExtraData(ACSP_DETAILS);
    session.deleteExtraData(ACSP_DETAILS_UPDATED);
    session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
    session.deleteExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
    session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME);
    session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
    session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS);
    session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS);
    session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE);
};
