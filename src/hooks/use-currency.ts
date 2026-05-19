import { useState, useEffect, useCallback } from "react";

export type QuotationRecord = {
  [key: string]: { code: string; quotation: number };
};

interface UseCurrencyReturn {
  quotations: QuotationRecord | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasValidQuotations: boolean;
}

export const useCurrency = (): UseCurrencyReturn => {
  const [quotations, setQuotations] = useState<QuotationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const formatted: QuotationRecord = {
      BRL: { code: "BRL", quotation: 1 },
      USD: { code: "USD", quotation: 5.15 },
      EUR: { code: "EUR", quotation: 5.55 },
    };

    setQuotations(formatted);
    localStorage.setItem("quotations_timestamp", new Date().getTime().toString());
    localStorage.setItem("quotations_data", JSON.stringify(formatted));

    setIsLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    await fetchQuotations();
  }, [fetchQuotations]);

  useEffect(() => {
    const lastTimestamp = localStorage.getItem("quotations_timestamp");
    const now = new Date().getTime();
    const ONE_HOUR_MS = 1000 * 60 * 60;

    if (!lastTimestamp || now - parseInt(lastTimestamp) > ONE_HOUR_MS) {
      fetchQuotations();
      return;
    }

    const cachedData = localStorage.getItem("quotations_data");
    if (cachedData) {
      try {
        setQuotations(JSON.parse(cachedData));
      } catch {
        fetchQuotations();
      }
    } else {
      fetchQuotations();
    }
  }, [fetchQuotations]);

  return {
    quotations,
    isLoading,
    error,
    refresh,
    hasValidQuotations: quotations !== null && error === null,
  };
};
