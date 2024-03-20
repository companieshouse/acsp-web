import mockAuthenticationMiddleware from "./authentication_middleware_mock";
import { mockSessionMiddleware, mockSessionMiddlewareWithInactiveCompany } from "./session_middleware_mock";
import mockCompanyAuthenticationMiddleware from "./company_authentication_middleware_mock";
import mockUKAddressesFromPostcode from "./postcode_lookup_service_mock";

export default {
    mockAuthenticationMiddleware,
    mockSessionMiddleware,
    mockSessionMiddlewareWithInactiveCompany,
    mockCompanyAuthenticationMiddleware,
    mockUKAddressesFromPostcode
};
