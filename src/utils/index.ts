import { SelectOptionType } from "../types";

export const generateRandomSixDigit = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const transformElementOptions = (
  options: string[]
): Omit<SelectOptionType, "error">[] => {
  if (!options) return [];
  return options.map((option) => ({ id: option, label: option }));
};
