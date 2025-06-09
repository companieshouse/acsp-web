import mockAuthenticationMiddleware from "./authentication_middleware_mock";
import mockAuthenticationMiddlewareForSoleTrader from "./authentication_middleware_sole_trader_mock";
import mockSessionMiddleware from "./session_middleware_mock";
import mockCompanyAuthenticationMiddleware from "./company_authentication_middleware_mock";
import mockUKAddressesFromPostcode from "./postcode_lookup_service_mock";
import updateAcsp from "./update_acsp_authentication_middleware_mock";
import closeAcsp from "./close_acsp_authentication_middleware_mock";
import mockCsrfProtectionMiddleware from "./csrf_protection_middleware_mock";
import mockGetAcspProfileMiddleware from "./close_acsp_get_acsp_profile_middleware_mock";
import mockGetUpdateAcspProfileMiddleware from "./update_acsp_get_update_acsp_profile_middleware_mock";

export default {
    mockAuthenticationMiddleware,
    mockAuthenticationMiddlewareForSoleTrader,
    mockSessionMiddleware,
    mockCompanyAuthenticationMiddleware,
    mockUKAddressesFromPostcode,
    mockCsrfProtectionMiddleware,
    mockGetAcspProfileMiddleware,
    mockGetUpdateAcspProfileMiddleware,
    ...updateAcsp,
    ...closeAcsp
};
