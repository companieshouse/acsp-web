import { ValidationError } from "express-validator";
import { getLocalesService } from "../utils/localise";

export type FormattedValidationErrors = {
    [key: string]: {
      text: string;
    },
  } & {
    errorList: {
      href: string,
      text: string,
    }[],
  };

export function formatValidationError (validationErrors: ValidationError[], lang?: string): FormattedValidationErrors {
    const errors = { errorList: [] } as any;
    const localesService = getLocalesService();
    validationErrors.forEach(validationResult => {
        let errorMessage = validationResult.msg;
        if (lang !== undefined) {
            const error = localesService.i18nCh.resolveSingleKey("error-" + validationResult.msg, lang);
            if (!error.startsWith("error-")) {
                errorMessage = error;
            }
        }
        // errors.errorList[] relates to the linked error messages at the top of the page
        errors.errorList.push({ href: "#" + validationResult.param, text: errorMessage });
        // errors[] relates to the highlighed fields and the message just above those fields
        errors[validationResult.param] = { text: errorMessage };
    });

    return errors;
}

/**
 * Returns page properties containing validation errors.
 * @param errors Formatted validation errors
 * @returns Page properties
 */

export const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
