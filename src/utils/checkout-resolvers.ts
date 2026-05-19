import { zodResolver } from "@hookform/resolvers/zod";
import {
  dynamicCheckoutSchema,
  brCheckoutSchema,
  usaCheckoutSchema,
  ptCheckoutSchema,
  type BRCheckoutFormData,
  type USACheckoutFormData,
  type PTCheckoutFormData,
  type CheckoutFormData,
} from "../schemas/checkout.schema";
import type { Country } from "../contexts/regional-config-context.types";
import type { Resolver } from "react-hook-form";

type CountryCheckoutDataMap = {
  BR: BRCheckoutFormData;
  USA: USACheckoutFormData;
  PT: PTCheckoutFormData;
};

type CheckoutFormDataUnion =
  | BRCheckoutFormData
  | USACheckoutFormData
  | PTCheckoutFormData
  | CheckoutFormData;

export function getCheckoutResolver(
  country: "BR",
): Resolver<BRCheckoutFormData>;
export function getCheckoutResolver(
  country: "USA",
): Resolver<USACheckoutFormData>;
export function getCheckoutResolver(
  country: "PT",
): Resolver<PTCheckoutFormData>;
export function getCheckoutResolver(country: Country): Resolver<any> {
  if (country === "BR") return zodResolver(brCheckoutSchema);
  if (country === "USA") return zodResolver(usaCheckoutSchema);
  if (country === "PT") return zodResolver(ptCheckoutSchema);
  throw new Error(`País não suportado: ${country}`);
}

export const getDynamicCheckoutResolver = () => {
  return zodResolver(dynamicCheckoutSchema);
};

export const getCheckoutResolverSafe = (
  country?: Country,
): Resolver<CheckoutFormDataUnion> => {
  if (country === "BR") {
    return getCheckoutResolver("BR") as Resolver<CheckoutFormDataUnion>;
  }
  if (country === "USA") {
    return getCheckoutResolver("USA") as Resolver<CheckoutFormDataUnion>;
  }
  if (country === "PT") {
    return getCheckoutResolver("PT") as Resolver<CheckoutFormDataUnion>;
  }
  return getDynamicCheckoutResolver() as Resolver<CheckoutFormDataUnion>;
};

export type {
  BRCheckoutFormData,
  USACheckoutFormData,
  PTCheckoutFormData,
  CheckoutFormData,
  CheckoutFormDataUnion,
  CountryCheckoutDataMap,
};
