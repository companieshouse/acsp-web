import { validationResult, ValidationError } from "express-validator";

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

export function formatValidationError (errorList: ValidationError[]): FormattedValidationErrors {
    const errors = { errorList: [] } as any;
    errorList.forEach(e => {
        errors.errorList.push({ href: `#${e.param}`, text: e.msg });
        errors[e.param] = { text: e.msg };
    });
    return errors;
}
