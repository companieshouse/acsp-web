// Generic handler is the base handler that is extended by all other services
// It contains methods that are common to multiple route services

import errorManifest from "../../../lib/utils/error_manifests/default";

export class GenericService {

    viewData: any;
    errorManifest: any;

    constructor () {
        this.errorManifest = errorManifest;
        this.viewData = {
            errors: {}
        };
    }

    processServiceException (err: any): Object {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }

    someCommonMethod (): Object {
        return {};
    }
};
