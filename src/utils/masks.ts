import { detectCardIssuer } from "./card-issuer";

export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  const issuer = detectCardIssuer(numbers);
  const maxLength = issuer === "amex" ? 15 : 16;
  const truncated = numbers.slice(0, maxLength);

  if (issuer === "amex") {
    return truncated.replace(/(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3").trim();
  } else {
    return truncated.replace(/(\d{4})/g, "$1 ").trim();
  }
};

export const formatExpiry = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  const truncated = numbers.slice(0, 4);

  if (truncated.length >= 3) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
  }
  return truncated;
};

export const formatCVC = (value: string, cardNumber: string): string => {
  const numbers = value.replace(/\D/g, "");
  const issuer = detectCardIssuer(cardNumber);
  const maxLength = issuer === "amex" ? 4 : 3;
  return numbers.slice(0, maxLength);
};

export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  return Number(value.replace(/\D/g, "")) / 100;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
