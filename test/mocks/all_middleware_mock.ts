import mockAuthenticationMiddleware from "./authentication_middleware_mock";
import mockAuthenticationMiddlewareForSoleTrader from "./authentication_middleware_sole_trader_mock";
import mockSessionMiddleware from "./session_middleware_mock";
import mockCompanyAuthenticationMiddleware from "./company_authentication_middleware_mock";
import mockUKAddressesFromPostcode from "./postcode_lookup_service_mock";
import updateAcsp from "./update_acsp_authentication_middleware_mock";
import mockCsrfProtectionMiddleware from "./csrf_protection_middleware_mock";

export default {
    mockAuthenticationMiddleware,
    mockAuthenticationMiddlewareForSoleTrader,
    mockSessionMiddleware,
    mockCompanyAuthenticationMiddleware,
    mockUKAddressesFromPostcode,
    mockCsrfProtectionMiddleware,
    ...updateAcsp
};
