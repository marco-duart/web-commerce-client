import type { ZodSchema } from "zod";

export type Country = "BR" | "USA" | "PT";
export type Currency = "BRL" | "USD" | "EUR";
export type DocumentType = "cpf" | "ssn" | "nif";

export interface RegionalConfig {
  code: Country;
  name: string;
  flag: string;
  currency: Currency;
  ddi: string;
  locale: string;
  phoneDigits: number;
  documentType: DocumentType;
  documentDigits: number;
}

export interface DocumentValidationRules {
  type: DocumentType;
  digits: number;
  pattern?: RegExp;
  label: string;
}

export interface PhoneValidationRules {
  ddi: string;
  digits: number;
  label: string;
}

export interface RegionalConfigContextType {
  selectedCountry: Country;
  regionalConfigs: Record<Country, RegionalConfig>;
  setCountry: (country: Country) => void;

  validatePhone: (phoneNumber: string, country?: Country) => boolean;
  validateDocument: (document: string, country?: Country) => boolean;
  getPhoneValidationRules: (country?: Country) => PhoneValidationRules;
  getDocumentValidationRules: (country?: Country) => DocumentValidationRules;

  formatValue: (valueInBRL: number, country?: Country) => string;
  convertValue: (
    value: number,
    fromCountry?: Country,
    toCountry?: Country,
  ) => number;
  getCurrencySymbol: (country?: Country) => string;
  getLocale: (country?: Country) => string;

  getRegionalConfig: (country?: Country) => RegionalConfig;
  getValidationSchema: (country?: Country) => ZodSchema;

  hasValidQuotations: boolean;
  currencyError: string | null;
  currencyLoading: boolean;
}
