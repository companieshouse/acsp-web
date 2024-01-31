import { body, ValidationChain } from "express-validator";
import nationalityErrorManifest from "../utils/error_manifests/nationality";
import nationalityList from '../../lib/nationalityList';


export const nationalityValidator: ValidationChain[] = [
  body('input-autocomplete')
    .isArray({ min: 1 }).withMessage(nationalityErrorManifest.validation.noNationality.summary)
    .custom((value) => {
      // Check if all selected nationalities are valid
      for (const nationality of value) {
        if (!nationalityList.includes(nationality)) {
          throw new Error(nationalityErrorManifest.validation.invalid.summary);
        }
      }
      return true;
    }),

  body('nationalityInputSecond')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
    .custom((value, { req }) => {
      if (value && value === req.body['input-autocomplete'][0]) {
        throw new Error(nationalityErrorManifest.validation.doubleSecondNationality.summary);
      }
      return true;
    }),

  body('nationalityInputThird')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
    .custom((value, { req }) => {
      const [firstNationality, secondNationality] = req.body['input-autocomplete'];
      if (value && (value === firstNationality || value === secondNationality)) {
        throw new Error(nationalityErrorManifest.validation.doubleThirdNationality.summary);
      }
      return true;
    }),
];
