export const COMPANY_NUMBER: string = "companyNumber";
export const COMPANY_DETAILS: string = "companyDetails";
export const SUBMISSION_ID: string = "submissionID";
export const USER_DATA = "user";
export const ACSP_DETAILS = "acspDetails";
export const ACSP_DETAILS_UPDATED = "updatedAcspDetails";
export const ACSP_DETAILS_UPDATE_IN_PROGRESS = "inProgressAcspDetails";
export const COMPANY: string = "company";
export const UNINCORPORATED_CORRESPONDENCE_ADDRESS: string = "unincorporated correspondenceAddress";
export const UNINCORPORATED_AML_SELECTED_OPTION = "unincorporatedAmlSelectedOption";
export const ADDRESS_LIST = "addressList";
export const GET_ACSP_REGISTRATION_DETAILS_ERROR: string = "Unable to get registration details for the transaction";
export const POST_ACSP_REGISTRATION_DETAILS_ERROR: string = "Unable to post registration details for the transaction";
export const PREVIOUS_PAGE_URL: string = "previouspageurl";
export const NO_PAYMENT_RESOURCE_ERROR: string = "No resource in payment response";
export const PAYEMNT_REFERENCE: string = "Register_ACSP_";
export const CLOSED: string = "closed";
export const REJECTED: string = "rejected";
export const ACCEPTED: string = "accepted";
export const CEASED: string = "ceased";
export const IN_PROGRESS: string = "in progress";
export const APPLICATION_ID: string = "application id";
export const RESUME_APPLICATION_ID: string = "resume application id";
export const headers = {
    PAYMENT_REQUIRED: "x-payment-required"
};
export const REQ_TYPE_UPDATE_ACSP: string = "updateAcsp";
export const ACSP_PROFILE_TYPE_LIMITED_COMPANY: string = "limited-company";
export const ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP: string = "limited-liability-partnership";
export const ACSP_PROFILE_TYPE_CORPORATE_BODY: string = "corporate-body";
export const ACSP_PROFILE_TYPE_SOLE_TRADER: string = "sole-trader";
export const LIMITED_BUSINESS_TYPES = [
    ACSP_PROFILE_TYPE_LIMITED_COMPANY,
    ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP,
    ACSP_PROFILE_TYPE_CORPORATE_BODY
];
export const UPDATE_DESCRIPTION: string = "Update the authorised agent's details";
export const UPDATE_REFERENCE: string = "ACSP update details";
export const UPDATE_SUBMISSION_ID: string = "updateSubmissionId";
export const CLOSE_DESCRIPTION: string = "Close the authorised agent's details";
export const CLOSE_REFERENCE: string = "ACSP close details";
export const CLOSE_SUBMISSION_ID: string = "closeSubmissionId";
export const NEW_AML_BODIES: string = "newAmlBodies";
export const NEW_AML_BODY: string = "newAmlBody";
export const ADD_AML_BODY_UPDATE: string = "addAmlBodyUpdate";
export const ACSP_UPDATE_PREVIOUS_PAGE_URL: string = "previousPageLocator";
export const ACSP_UPDATE_CHANGE_DATE = {
    NAME: "applicantName",
    WHERE_DO_YOU_LIVE: "whereDoYouLive",
    NAME_OF_BUSINESS: "nameOfBusiness",
    REGISTERED_OFFICE_ADDRESS: "registeredOfficeAddress",
    CORRESPONDENCE_ADDRESS: "correspondenceAddress"
};
export const AML_REMOVAL_INDEX = "amlRemovalIndex";
export const AML_REMOVAL_BODY = "amlRemovalBody";
export const AML_REMOVED_BODY_DETAILS = "amlRemovedBodyDetails";
export const REGISTRATION = "registration";
export const UPDATE = "update";
export const SERVICE_ADDRESS = "serviceAddress";
export const REGISTERED_OFFICE_ADDRESS = "registeredOfficeAddress";
export const TYPE_OF_BUSINESS_SELECTED = "typeOfBusinessSelected";
