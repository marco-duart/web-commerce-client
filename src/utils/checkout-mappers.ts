import type { CheckoutFormData } from "../schemas/checkout.schema";
import type { Country } from "../contexts/regional-config-context.types";

export const mapCheckoutDataByCountry = (
  data: CheckoutFormData,
  country: Country,
) => {
  const { document, ...restData } = data;

  const countryMap: Record<Country, Record<string, unknown>> = {
    BR: {
      ...restData,
      cpf: document,
    },
    USA: {
      ...restData,
      ssn: document,
    },
    PT: {
      ...restData,
      nif: document,
    },
  };

  return countryMap[country];
};

export const mapClientDataForCheckout = (
  data: CheckoutFormData,
  country: Country,
) => {
  const mapped = mapCheckoutDataByCountry(data, country);

  return {
    name: mapped.name,
    email: mapped.email,
    phone: `${mapped.ddi}${mapped.phone}`,
    document:
      mapped[country === "BR" ? "cpf" : country === "USA" ? "ssn" : "nif"],
    ddi: mapped.ddi,
  };
};
