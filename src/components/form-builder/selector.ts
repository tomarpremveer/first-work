import { FormElement } from "../../types";

export const formValidator = (formElements: FormElement[]): FormElement[] => {
  return formElements.map((element) => {
    let updatedOptions = element.options || [];
    let updatedValidations = element.validations || [];
    let elementError = "";

    if (!element.label || element.label.trim() === "") {
      elementError = "Label is required.";
    }

    if (element.type === "select") {
      if (!element.options || element.options.length === 0) {
        elementError = "Select field must have options.";
      } else {
        updatedOptions = element.options.map((option) => ({
          ...option,
          error:
            !option.label || option.label.trim() === ""
              ? "Option cannot be empty."
              : "",
        }));

        if (updatedOptions.some((opt) => opt.error)) {
          elementError = "All select options must have a value.";
        }
      }
    }

    updatedValidations =
      element.validations?.map((validation) => ({
        ...validation,
        error:
          !validation.type || validation.type.trim() === ""
            ? "Validation type is required."
            : validation.value === undefined || validation.value === ""
            ? "Validation value is required."
            : !validation.message || validation.message.trim() === ""
            ? "Validation message is required."
            : "",
      })) || [];

    return {
      ...element,
      error: elementError,
      options: updatedOptions,
      validations: updatedValidations,
    };
  });
};
