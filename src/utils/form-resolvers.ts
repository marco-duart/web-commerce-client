import { zodResolver } from "@hookform/resolvers/zod";
import {
  dynamicClientFormSchema,
  brClientFormSchema,
  usaClientFormSchema,
  ptClientFormSchema,
  type BRClientFormData,
  type USAClientFormData,
  type PTClientFormData,
} from "../schemas/client-form.schema";
import type { Resolver } from "react-hook-form";

export function getClientFormResolver(
  country: "BR",
): Resolver<BRClientFormData>;
export function getClientFormResolver(
  country: "USA",
): Resolver<USAClientFormData>;
export function getClientFormResolver(
  country: "PT",
): Resolver<PTClientFormData>;
export function getClientFormResolver(
  country: "BR" | "USA" | "PT",
): Resolver<any> {
  if (country === "BR") return zodResolver(brClientFormSchema);
  if (country === "USA") return zodResolver(usaClientFormSchema);
  if (country === "PT") return zodResolver(ptClientFormSchema);
  throw new Error(`País não suportado: ${country}`);
}

export const getDynamicClientFormResolver = () => {
  return zodResolver(dynamicClientFormSchema);
};
