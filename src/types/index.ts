import { FORM_ELEMENT } from "../constants";

export type SelectOptionType = {
  id: number;
  label: string;
  error?: string;
};
export interface ValidationType {
  type: ValidationTypes;
  value?: any;
  message?: string;
  id: number;
  error?: string;
}

interface BaseFormElement {
  id: number;
  label: string;
  type: FormElementType;
  isRequired: boolean;
  placeholder?: string;
  defaultValue?: string | number | string[];
  options?: SelectOptionType[];
  validations?: ValidationType[];
  isActive: boolean;
  error?: string;
}

interface TextFormElement extends BaseFormElement {
  type: "text";
}

interface EmailFormElement extends BaseFormElement {
  type: "email";
}

interface NumberFormElement extends BaseFormElement {
  type: "number";
}

interface SelectFormElement extends BaseFormElement {
  type: "select";
  options: SelectOptionType[];
}

export type FormElement =
  | TextFormElement
  | EmailFormElement
  | NumberFormElement
  | SelectFormElement;

export type FormElementType = (typeof FORM_ELEMENT)[keyof typeof FORM_ELEMENT];

export type ValidationTypes = "equal" | "min" | "max" | "regex" | "required";
