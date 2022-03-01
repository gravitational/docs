import { ValidateFunction } from "ajv";

/*
 * If validation return erros, write them to console and exit.
 */

export const validateConfig = <T = Record<string, unknown>>(
  validator: ValidateFunction,
  config: T
) => {
  if (!validator(config)) {
    console.error(validator.errors);

    process.exit(1);
  }
};
