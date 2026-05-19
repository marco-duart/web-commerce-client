import React, { createContext, useContext, useState, useCallback } from "react";
import { useCurrency } from "../hooks/use-currency";
import { getClientFormSchema } from "../schemas/client-form.schema";
import type {
  Country,
  RegionalConfig,
  DocumentValidationRules,
  PhoneValidationRules,
  RegionalConfigContextType,
} from "./regional-config-context.types";

const RegionalConfigContext = createContext<
  RegionalConfigContextType | undefined
>(undefined);

const regionalConfigs: Record<Country, RegionalConfig> = {
  BR: {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    currency: "BRL",
    ddi: "+55",
    locale: "pt-BR",
    phoneDigits: 11,
    documentType: "cpf",
    documentDigits: 11,
  },
  USA: {
    code: "USA",
    name: "Estados Unidos",
    flag: "🇺🇸",
    currency: "USD",
    ddi: "+1",
    locale: "en-US",
    phoneDigits: 10,
    documentType: "ssn",
    documentDigits: 9,
  },
  PT: {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    currency: "EUR",
    ddi: "+351",
    locale: "de-DE",
    phoneDigits: 9,
    documentType: "nif",
    documentDigits: 9,
  },
};

const documentLabels: Record<string, string> = {
  cpf: "CPF",
  ssn: "SSN",
  nif: "NIF",
};

interface Props {
  children: React.ReactNode;
  defaultCountry?: Country;
}

export const RegionalConfigProvider: React.FC<Props> = ({
  children,
  defaultCountry = "BR",
}) => {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);
  const { quotations, hasValidQuotations, error, isLoading } = useCurrency();

  React.useEffect(() => {
    if (error) {
      console.error("[RegionalConfigContext] Erro ao obter cotações:", error);
    }
  }, [error]);

  const validatePhone = useCallback(
    (phoneNumber: string, country?: Country): boolean => {
      const targetCountry = country || selectedCountry;
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const config = regionalConfigs[targetCountry];

      return cleanPhone.length === config.phoneDigits;
    },
    [selectedCountry],
  );

  const validateDocument = useCallback(
    (document: string, country?: Country): boolean => {
      const targetCountry = country || selectedCountry;
      const cleanDoc = document.replace(/\D/g, "");
      const config = regionalConfigs[targetCountry];

      return cleanDoc.length === config.documentDigits;
    },
    [selectedCountry],
  );

  const getPhoneValidationRules = useCallback(
    (country?: Country): PhoneValidationRules => {
      const targetCountry = country || selectedCountry;
      const config = regionalConfigs[targetCountry];

      return {
        ddi: config.ddi,
        digits: config.phoneDigits,
        label: `Telefone (${config.phoneDigits} dígitos)`,
      };
    },
    [selectedCountry],
  );

  const getDocumentValidationRules = useCallback(
    (country?: Country): DocumentValidationRules => {
      const targetCountry = country || selectedCountry;
      const config = regionalConfigs[targetCountry];

      return {
        type: config.documentType,
        digits: config.documentDigits,
        label: `${documentLabels[config.documentType]} (${config.documentDigits} dígitos)`,
      };
    },
    [selectedCountry],
  );

  const convertValue = useCallback(
    (value: number, fromCountry?: Country, toCountry?: Country): number => {
      const from = fromCountry || selectedCountry;
      const to = toCountry || selectedCountry;

      if (from === to) return value;

      if (!quotations) {
        console.warn(
          "[RegionalConfig] Cotações não disponíveis. Retornando valor sem conversão.",
        );
        return value;
      }

      const fromConfig = regionalConfigs[from];
      const toConfig = regionalConfigs[to];

      let valueInBRL: number;

      if (fromConfig.currency === "BRL") {
        valueInBRL = value;
      } else {
        const fromQuotation = quotations[fromConfig.currency]?.quotation;
        if (!fromQuotation) {
          console.warn(
            `[RegionalConfig] Cotação para ${fromConfig.currency} não disponível`,
          );
          return value;
        }
        valueInBRL = value * fromQuotation;
      }

      if (toConfig.currency === "BRL") {
        return valueInBRL;
      } else {
        const toQuotation = quotations[toConfig.currency]?.quotation;
        if (!toQuotation) {
          console.warn(
            `[RegionalConfig] Cotação para ${toConfig.currency} não disponível`,
          );
          return value;
        }
        return valueInBRL / toQuotation;
      }
    },
    [selectedCountry, quotations],
  );

  const getCurrencySymbol = useCallback(
    (country?: Country): string => {
      const targetCountry = country || selectedCountry;
      const config = regionalConfigs[targetCountry];

      switch (config.currency) {
        case "BRL":
          return "R$";
        case "USD":
          return "$";
        case "EUR":
          return "€";
        default:
          return "R$";
      }
    },
    [selectedCountry],
  );

  const getLocale = useCallback(
    (country?: Country): string => {
      const targetCountry = country || selectedCountry;
      return regionalConfigs[targetCountry].locale;
    },
    [selectedCountry],
  );

  const formatValue = useCallback(
    (valueInBRL: number, country?: Country): string => {
      const targetCountry = country || selectedCountry;
      const config = regionalConfigs[targetCountry];

      const convertedValue = convertValue(valueInBRL, "BR", targetCountry);
      const locale = getLocale(targetCountry);

      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: config.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatter.format(convertedValue);
    },
    [selectedCountry, convertValue, getLocale],
  );

  const getRegionalConfig = useCallback(
    (country?: Country): RegionalConfig => {
      const targetCountry = country || selectedCountry;
      return regionalConfigs[targetCountry];
    },
    [selectedCountry],
  );

  const getValidationSchema = useCallback(
    (country?: Country) => {
      const targetCountry = country || selectedCountry;
      return getClientFormSchema(targetCountry);
    },
    [selectedCountry],
  );

  const contextValue: RegionalConfigContextType = {
    selectedCountry,
    regionalConfigs,
    setCountry: setSelectedCountry,
    validatePhone,
    validateDocument,
    getPhoneValidationRules,
    getDocumentValidationRules,
    formatValue,
    convertValue,
    getCurrencySymbol,
    getLocale,
    getRegionalConfig,
    getValidationSchema,
    hasValidQuotations,
    currencyError: error,
    currencyLoading: isLoading,
  };

  return (
    <RegionalConfigContext.Provider value={contextValue}>
      {children}
    </RegionalConfigContext.Provider>
  );
};

export const useRegionalConfig = (): RegionalConfigContextType => {
  const context = useContext(RegionalConfigContext);
  if (context === undefined) {
    throw new Error(
      "useRegionalConfig deve ser usado dentro de um RegionalConfigProvider",
    );
  }
  return context;
};
