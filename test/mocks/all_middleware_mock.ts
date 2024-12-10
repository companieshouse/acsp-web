import mockAuthenticationMiddleware from "./authentication_middleware_mock";
import mockAuthenticationMiddlewareForSoleTrader from "./authentication_middleware_sole_trader_mock";
import mockSessionMiddleware from "./session_middleware_mock";
import mockCompanyAuthenticationMiddleware from "./company_authentication_middleware_mock";
import mockUKAddressesFromPostcode from "./postcode_lookup_service_mock";
import mockAcspAuthenticationMiddleware from "./update_acsp_authentication_middleware_mock";

export default {
    mockAuthenticationMiddleware,
    mockAuthenticationMiddlewareForSoleTrader,
    mockSessionMiddleware,
    mockCompanyAuthenticationMiddleware,
    mockUKAddressesFromPostcode,
    mockAcspAuthenticationMiddleware
};
