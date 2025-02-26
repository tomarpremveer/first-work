import { FormElement } from "../../types";

export const validateElement = (
  element: FormElement,
  value: any
): string | null => {
  if (
    element.isRequired &&
    (value === null || value === undefined || value === "")
  ) {
    return "Field is required";
  }

  if (element.validations) {
    for (const validation of element.validations) {
      switch (validation.type) {
        case "max":
          if (element.type === "text") {
            if (value && value.length > validation.value) {
              return (
                validation.message || `Maximum length is ${validation.value}.`
              );
            }
          } else if (element.type === "number") {
            if (value && Number(value) > validation.value) {
              return (
                validation.message || `Maximum value is ${validation.value}.`
              );
            }
          }
          break;

        case "min":
          if (element.type === "text") {
            if (value && value.length < validation.value) {
              return (
                validation.message || `Minimum length is ${validation.value}.`
              );
            }
          } else if (element.type === "number") {
            if (value && Number(value) < validation.value) {
              return (
                validation.message || `Minimum value is ${validation.value}.`
              );
            }
          }
          break;

        case "regex":
          if (
            value &&
            typeof value === "string" &&
            !new RegExp(validation.value).test(value)
          ) {
            return validation.message || "Invalid format.";
          }
          break;

        default:
          if (value !== validation.value) {
            return validation.message || "Value should be equal";
          }
          break;
      }
    }
  }

  return null;
};
